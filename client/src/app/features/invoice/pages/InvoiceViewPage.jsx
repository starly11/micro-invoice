import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useInvoice } from "../hooks/useInvoice"
import { useUpdateInvoice } from "../hooks/useUpdateInvoice"
import { useDeleteInvoice } from "../hooks/useDeleteInvoice"
import InvoicePreview from "../../invoice-genrator/components/InvoicePreview"
import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { downloadInvoicePDF } from "../../invoice-genrator/utils/exportInvoice"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export function InvoiceViewPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const invoiceQuery = useInvoice(id)
    const updateMutation = useUpdateInvoice()
    const deleteMutation = useDeleteInvoice()
    const replaceInvoice = useInvoiceStore((s) => s.replaceInvoice)

    useEffect(() => {
        if (invoiceQuery.data) {
            replaceInvoice(invoiceQuery.data)
        }
    }, [invoiceQuery.data, replaceInvoice])

    if (invoiceQuery.isLoading) {
        return <div className="p-6"><Spinner label="Loading invoice..." /></div>
    }

    if (invoiceQuery.isError || !invoiceQuery.data) {
        return (
            <div className="p-6 space-y-3">
                <div className="text-sm text-red-600">Failed to load invoice.</div>
                <Button variant="outline" onClick={() => invoiceQuery.refetch()}>Retry</Button>
            </div>
        )
    }

    const invoice = invoiceQuery.data

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" asChild>
                        <Link to="/dashboard">Back to Dashboard</Link>
                    </Button>
                    <div className="font-semibold">Invoice #{invoice?.meta?.invoiceNumber || "—"}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link to={`/invoice/edit/${id}`}>Edit</Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            downloadInvoicePDF({
                                fileName: invoice?.meta?.invoiceNumber || "Invoice",
                            })
                        }
                    >
                        Download PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={async () => {
                            await updateMutation.mutateAsync({
                                id,
                                payload: {
                                    business: invoice.business,
                                    client: invoice.client,
                                    items: invoice.items,
                                    meta: invoice.meta,
                                    currency: invoice.currency,
                                    taxRate: invoice.taxRate,
                                    notes: invoice.notes,
                                    status: "paid",
                                },
                            })
                            toast.success("Marked as paid")
                            invoiceQuery.refetch()
                        }}
                    >
                        Mark as Paid
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={async () => {
                            await deleteMutation.mutateAsync(id)
                            toast.success("Invoice deleted")
                            navigate("/dashboard")
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
                <aside className="lg:col-span-3 rounded-lg border p-4 space-y-2 text-sm">
                    <div><span className="font-semibold">Status:</span> {invoice.status}</div>
                    <div><span className="font-semibold">Amount:</span> {invoice.total}</div>
                    <div><span className="font-semibold">Date:</span> {invoice?.meta?.issueDate}</div>
                    <div><span className="font-semibold">Due:</span> {invoice?.meta?.dueDate}</div>
                    <div className="pt-3">
                        <div className="font-semibold">Client</div>
                        <div>{invoice?.client?.name}</div>
                        <div>{invoice?.client?.email}</div>
                    </div>
                    <div className="pt-3">
                        <div><span className="font-semibold">Created:</span> {new Date(invoice.createdAt).toLocaleString()}</div>
                        <div><span className="font-semibold">Last Modified:</span> {new Date(invoice.updatedAt).toLocaleString()}</div>
                    </div>
                </aside>
                <div className="lg:col-span-7">
                    <InvoicePreview />
                </div>
            </div>
        </div>
    )
}
