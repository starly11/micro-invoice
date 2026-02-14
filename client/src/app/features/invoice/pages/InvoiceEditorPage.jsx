import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import InvoiceForm from "../../invoice-genrator/components/InvoiceForm"
import InvoicePreview from "../../invoice-genrator/components/InvoicePreview"
import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { useInvoice } from "../hooks/useInvoice"
import { useCreateInvoice } from "../hooks/useCreateInvoice"
import { useUpdateInvoice } from "../hooks/useUpdateInvoice"
import { downloadInvoicePDF } from "../../invoice-genrator/utils/exportInvoice"
import { hasInvoiceContent } from "../../invoice-genrator/utils/hasInvoiceContent"
import { Spinner } from "@/components/ui/spinner"

export function InvoiceEditorPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)
    const currentInvoice = useInvoiceStore((s) => s.invoice)
    const replaceInvoice = useInvoiceStore((s) => s.replaceInvoice)
    const resetInvoice = useInvoiceStore((s) => s.resetInvoice)
    const status = useInvoiceStore((s) => s.invoice.status || "unpaid")
    const setStatus = useInvoiceStore((s) => s.setStatus)
    const [currentId, setCurrentId] = useState(id || null)
    const lastPayloadRef = useRef("")

    const invoiceQuery = useInvoice(id)
    const createMutation = useCreateInvoice()
    const updateMutation = useUpdateInvoice()

    useEffect(() => {
        if (isEdit && invoiceQuery.data) {
            replaceInvoice(invoiceQuery.data)
            setCurrentId(invoiceQuery.data._id || invoiceQuery.data.id || id)
        }
    }, [isEdit, invoiceQuery.data, replaceInvoice, id])

    useEffect(() => {
        if (!isEdit) {
            resetInvoice()
            setCurrentId(null)
        }
    }, [isEdit, resetInvoice])

    const payload = useMemo(
        () => ({
            business: currentInvoice.business,
            client: currentInvoice.client,
            items: currentInvoice.items,
            meta: currentInvoice.meta,
            currency: currentInvoice.currency,
            taxRate: currentInvoice.taxRate,
            notes: currentInvoice.notes,
            status: currentInvoice.status || "unpaid",
        }),
        [currentInvoice]
    )

    const saveInvoice = async ({ forceStatus, silent } = {}) => {
        const toSave = {
            ...payload,
            status: forceStatus || payload.status,
        }

        const serialized = JSON.stringify(toSave)
        if (silent && serialized === lastPayloadRef.current) return

        let result
        try {
            if (currentId) {
                result = await updateMutation.mutateAsync({ id: currentId, payload: toSave })
            } else {
                result = await createMutation.mutateAsync(toSave)
                setCurrentId(result?._id || result?.id)
            }
        } catch (error) {
            if (!silent) {
                if (error?.code === "UPGRADE_REQUIRED" || error?.status === 403) {
                    toast.error("Free limit reached. Upgrade to remove limits.")
                    navigate("/dashboard")
                } else {
                    toast.error(error?.message || "Failed to save invoice")
                }
            }
            throw error
        }

        lastPayloadRef.current = serialized
        if (!silent) {
            toast.success("Invoice saved")
        }
        return result
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!hasInvoiceContent(payload)) return
            try {
                await saveInvoice({ forceStatus: "draft", silent: true })
            } catch {
                // Keep autosave failures silent; explicit saves show errors.
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [payload])

    if (isEdit && invoiceQuery.isLoading) {
        return <div className="p-6"><Spinner label="Loading invoice..." /></div>
    }

    if (isEdit && invoiceQuery.isError) {
        return (
            <div className="p-6 space-y-3">
                <div className="text-sm text-red-600">Failed to load invoice.</div>
                <Button variant="outline" onClick={() => invoiceQuery.refetch()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">{isEdit ? "Edit Invoice" : "New Invoice"}</h1>
                <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600" htmlFor="status">Status</label>
                    <select
                        id="status"
                        className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <InvoiceForm showExportActions={false} />
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => saveInvoice({ forceStatus: "draft" })}>Save Draft</Button>
                        <Button
                            variant="outline"
                            onClick={async () => {
                                if (!hasInvoiceContent(currentInvoice)) {
                                    toast.error("Add invoice details before downloading PDF.")
                                    return
                                }
                                await saveInvoice({})
                                await downloadInvoicePDF({
                                    fileName: currentInvoice.meta?.invoiceNumber || "Invoice",
                                })
                            }}
                        >
                            Save & Download PDF
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link to="/dashboard">Cancel</Link>
                        </Button>
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <div className="w-full overflow-hidden">
                        <InvoicePreview />
                    </div>
                </div>
            </div>
        </div>
    )
}
