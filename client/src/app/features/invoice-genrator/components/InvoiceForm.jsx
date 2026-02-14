import React, { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Upload, Image as ImageIcon } from "lucide-react"
import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { useAuthStore } from "../../auth/store/authStore"
import { updateBusinessApi } from "../../account/api/account"
import { downloadInvoicePDF, previewInvoiceImage } from "../utils/exportInvoice"
import { TemplateModal } from "./TemplateModal"
import { useInvoiceTotals } from "../hooks/useInvoiceTotal"
import { formatCurrency } from "../utils/formatCurrency"
import { toast } from "sonner"
import { hasInvoiceContent } from "../utils/hasInvoiceContent"

const MAX_LOGO_FILE_SIZE_BYTES = 2 * 1024 * 1024

export default function InvoiceForm({
    showExportActions = true,
    canExportInvoice,
    onInvoiceExported,
}) {
    const user = useAuthStore((s) => s.user)
    const setUser = useAuthStore((s) => s.setUser)
    const invoice = useInvoiceStore((s) => s.invoice)
    const businessName = useInvoiceStore((s) => s.invoice.business.name)
    const businessEmail = useInvoiceStore((s) => s.invoice.business.email)
    const businessPhone = useInvoiceStore((s) => s.invoice.business.phone)
    const businessAddressLine1 = useInvoiceStore((s) => s.invoice.business.addressLine1)
    const businessAddressLine2 = useInvoiceStore((s) => s.invoice.business.addressLine2)
    const businessCityStateZip = useInvoiceStore((s) => s.invoice.business.cityStateZip)
    const businessLogoUrl = useInvoiceStore((s) => s.invoice.business.logoUrl)
    const clientName = useInvoiceStore((s) => s.invoice.client.name)
    const clientEmail = useInvoiceStore((s) => s.invoice.client.email)
    const clientAddressLine1 = useInvoiceStore((s) => s.invoice.client.addressLine1)
    const clientAddressLine2 = useInvoiceStore((s) => s.invoice.client.addressLine2)
    const clientCityStateZip = useInvoiceStore((s) => s.invoice.client.cityStateZip)
    const invoiceNumber = useInvoiceStore((s) => s.invoice.meta.invoiceNumber)
    const issueDate = useInvoiceStore((s) => s.invoice.meta.issueDate)
    const dueDate = useInvoiceStore((s) => s.invoice.meta.dueDate)
    const currency = useInvoiceStore((s) => s.invoice.currency)
    const taxRate = useInvoiceStore((s) => s.invoice.taxRate)
    const notes = useInvoiceStore((s) => s.invoice.notes)
    const items = useInvoiceStore((s) => s.invoice.items)
    const setBusinessName = useInvoiceStore((s) => s.setBusinessName)
    const setBusinessEmail = useInvoiceStore((s) => s.setBusinessEmail)
    const setBusinessPhone = useInvoiceStore((s) => s.setBusinessPhone)
    const setBusinessAddressLine1 = useInvoiceStore((s) => s.setBusinessAddressLine1)
    const setBusinessAddressLine2 = useInvoiceStore((s) => s.setBusinessAddressLine2)
    const setBusinessCityStateZip = useInvoiceStore((s) => s.setBusinessCityStateZip)
    const setBusinessLogoUrl = useInvoiceStore((s) => s.setBusinessLogoUrl)
    const setClientName = useInvoiceStore((s) => s.setClientName)
    const setClientEmail = useInvoiceStore((s) => s.setClientEmail)
    const setClientAddressLine1 = useInvoiceStore((s) => s.setClientAddressLine1)
    const setClientAddressLine2 = useInvoiceStore((s) => s.setClientAddressLine2)
    const setClientCityStateZip = useInvoiceStore((s) => s.setClientCityStateZip)
    const setInvoiceNumber = useInvoiceStore((s) => s.setInvoiceNumber)
    const setIssueDate = useInvoiceStore((s) => s.setIssueDate)
    const setDueDate = useInvoiceStore((s) => s.setDueDate)
    const setCurrency = useInvoiceStore((s) => s.setCurrency)
    const setNotes = useInvoiceStore((s) => s.setNotes)
    const setTaxRate = useInvoiceStore((s) => s.setTaxRate)
    const addItem = useInvoiceStore((s) => s.addItem)
    const updateItem = useInvoiceStore((s) => s.updateItem)
    const removeItem = useInvoiceStore((s) => s.removeItem)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isTemplateOpen, setIsTemplateOpen] = useState(false)
    const { subtotal, tax, total, currency: totalsCurrency } = useInvoiceTotals()
    const canExport = hasInvoiceContent(invoice)
    const shouldHydrateBusiness = useMemo(
        () =>
            Boolean(
                user?.business &&
                !businessName &&
                !businessEmail &&
                !businessPhone &&
                !businessAddressLine1 &&
                !businessAddressLine2 &&
                !businessCityStateZip &&
                !businessLogoUrl
            ),
        [
            user?.business,
            businessName,
            businessEmail,
            businessPhone,
            businessAddressLine1,
            businessAddressLine2,
            businessCityStateZip,
            businessLogoUrl,
        ]
    )

    useEffect(() => {
        if (!shouldHydrateBusiness || !user?.business) return
        setBusinessName(user.business.name || "")
        setBusinessEmail(user.business.email || "")
        setBusinessPhone(user.business.phone || "")
        setBusinessAddressLine1(user.business.addressLine1 || "")
        setBusinessAddressLine2(user.business.addressLine2 || "")
        setBusinessCityStateZip(user.business.cityStateZip || "")
        setBusinessLogoUrl(user.business.logoUrl || "")
        if (user.business.defaultCurrency) {
            setCurrency(user.business.defaultCurrency)
        }
        if (Number.isFinite(Number(user.business.defaultTaxRate))) {
            setTaxRate(Number(user.business.defaultTaxRate))
        }
    }, [
        shouldHydrateBusiness,
        user?.business,
        setBusinessName,
        setBusinessEmail,
        setBusinessPhone,
        setBusinessAddressLine1,
        setBusinessAddressLine2,
        setBusinessCityStateZip,
        setBusinessLogoUrl,
        setCurrency,
        setTaxRate,
    ])

    const handleLogoUpload = (file) => {
        if (!file) return
        if (file.size > MAX_LOGO_FILE_SIZE_BYTES) {
            toast.error("Logo is too large. Please upload an image under 2MB.")
            return
        }
        const reader = new FileReader()
        reader.onload = async () => {
            const imageData = String(reader.result || "")
            setBusinessLogoUrl(imageData)

            if (!user) return
            try {
                const updatedUser = await updateBusinessApi({ logoUrl: imageData })
                const persistedLogoUrl = updatedUser?.business?.logoUrl || ""
                setBusinessLogoUrl(persistedLogoUrl)
                setUser(updatedUser)
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to save logo")
            }
        }
        reader.readAsDataURL(file)
    }

    const handleDownload = async () => {
        if (!canExport) {
            toast.error("Add invoice details before downloading PDF.")
            return
        }
        if (typeof canExportInvoice === "function") {
            const allowed = await canExportInvoice()
            if (!allowed) return
        }
        if (isDownloading) return
        setIsDownloading(true)
        try {
            await downloadInvoicePDF({
                fileName: invoiceNumber ? `Invoice-${invoiceNumber}` : "Invoice",
            })
            if (typeof onInvoiceExported === "function") {
                onInvoiceExported()
            }
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Card className="p-6 bg-white space-y-8 border-none shadow-lg">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Invoice Details</h2>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsTemplateOpen(true)}>
                    Choose Template
                </Button>
            </div>

            {isTemplateOpen && (
                <TemplateModal onClose={() => setIsTemplateOpen(false)} />
            )}

            {/* BUSINESS SECTION */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Your Business</h3>
                <div className="grid gap-4">
                    <div>
                        <Label>Business Name</Label>
                        <Input
                            value={businessName ?? ""}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Acme Corp"
                        />
                    </div>
                    <div>
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            value={businessEmail ?? ""}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder="billing@acme.com"
                        />
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input
                            value={businessPhone ?? ""}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                            placeholder="(555) 123-4567"
                        />
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input
                            value={businessAddressLine1 ?? ""}
                            onChange={(e) => setBusinessAddressLine1(e.target.value)}
                            placeholder="123 Business St"
                        />
                    </div>
                    <div>
                        <Input
                            value={businessAddressLine2 ?? ""}
                            onChange={(e) => setBusinessAddressLine2(e.target.value)}
                            placeholder="Suite 100"
                        />
                    </div>
                    <div>
                        <Input
                            value={businessCityStateZip ?? ""}
                            onChange={(e) => setBusinessCityStateZip(e.target.value)}
                            placeholder="City, State ZIP"
                        />
                    </div>
                    <div>
                        <Label>Logo (optional)</Label>
                        <div className="flex items-center gap-3">
                            <input
                                id="business-logo-upload"
                                className="hidden"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                            />
                            <label
                                htmlFor="business-logo-upload"
                                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-white px-3 text-sm text-slate-700"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Image
                            </label>
                            {businessLogoUrl ? (
                                <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                                    <ImageIcon className="h-4 w-4" />
                                    Logo selected
                                </div>
                            ) : null}
                            {businessLogoUrl ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                        setBusinessLogoUrl("")
                                        if (!user) return
                                        try {
                                            const updatedUser = await updateBusinessApi({ logoUrl: "" })
                                            setUser(updatedUser)
                                        } catch (error) {
                                            toast.error(error?.response?.data?.message || "Failed to remove logo")
                                        }
                                    }}
                                >
                                    Remove
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            {/* CLIENT SECTION */}
            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Bill To</h3>
                <div className="grid gap-4">
                    <div>
                        <Label>Client Name</Label>
                        <Input
                            value={clientName ?? ""}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Client Name"
                        />
                    </div>
                    <div>
                        <Label>Client Email</Label>
                        <Input
                            type="email"
                            value={clientEmail ?? ""}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="client@email.com"
                        />
                    </div>
                    <div>
                        <Label>Client Address</Label>
                        <Input
                            value={clientAddressLine1 ?? ""}
                            onChange={(e) => setClientAddressLine1(e.target.value)}
                            placeholder="456 Client Ave"
                        />
                    </div>
                    <div>
                        <Input
                            value={clientAddressLine2 ?? ""}
                            onChange={(e) => setClientAddressLine2(e.target.value)}
                            placeholder="Suite 200"
                        />
                    </div>
                    <div>
                        <Input
                            value={clientCityStateZip ?? ""}
                            onChange={(e) => setClientCityStateZip(e.target.value)}
                            placeholder="City, State ZIP"
                        />
                    </div>
                </div>
            </section>

            {/* INVOICE DETAILS */}
            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Invoice Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Invoice #</Label>
                        <Input
                            value={invoiceNumber ?? ""}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Issue Date</Label>
                        <Input
                            type="date"
                            value={issueDate ?? ""}
                            onChange={(e) => setIssueDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Due Date</Label>
                        <Input
                            type="date"
                            value={dueDate ?? ""}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Currency</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CAD">CAD</option>
                            <option value="AUD">AUD</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* LINE ITEMS */}
            <section className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Line Items</h3>
                    <Button onClick={addItem} variant="outline" size="sm" className="gap-1">
                        <Plus className="w-4 h-4" /> Add Item
                    </Button>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-end p-3 rounded-lg border bg-slate-50/30">
                            <div className="flex-[3]">
                                <Label className="text-[10px] text-slate-400 uppercase">Description</Label>
                                <Input
                                    value={item.description ?? ""}
                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                    placeholder="Service description"
                                    className="bg-white"
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="text-[10px] text-slate-400 uppercase">Qty</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={Number.isFinite(item.quantity) ? item.quantity : 0}
                                    onChange={(e) =>
                                        updateItem(item.id, {
                                            quantity: Number(e.target.value || 0),
                                        })
                                    }
                                    className="bg-white"
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="text-[10px] text-slate-400 uppercase">Price</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={Number.isFinite(item.rate) ? item.rate : 0}
                                    onChange={(e) =>
                                        updateItem(item.id, {
                                            rate: Number(e.target.value || 0),
                                        })
                                    }
                                    className="bg-white"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3 border-t pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Totals</h3>
                <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal, totalsCurrency)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                        <Label>Tax Rate (%)</Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={Number.isFinite(taxRate) ? taxRate : 0}
                            onChange={(e) => setTaxRate(Number(e.target.value || 0))}
                        />
                    </div>
                    <div className="text-sm flex items-center justify-between border rounded-md px-3 h-9">
                        <span>Tax</span>
                        <span>{formatCurrency(tax, totalsCurrency)}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold border-t pt-3">
                    <span>Total</span>
                    <span>{formatCurrency(total, totalsCurrency)}</span>
                </div>
            </section>

            <section className="space-y-2 border-t pt-6">
                <Label>Notes</Label>
                <textarea
                    className="min-h-[96px] w-full rounded-md border border-input bg-white p-2 text-sm"
                    placeholder="Payment terms, thank you note, etc."
                    value={notes ?? ""}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </section>

            {showExportActions ? (
                <section className="border-t pt-6">
                    <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsTemplateOpen(true)}>
                            Choose Template
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                if (!canExport) {
                                    toast.error("Add invoice details before previewing PDF.")
                                    return
                                }
                                if (typeof canExportInvoice === "function") {
                                    const allowed = await canExportInvoice()
                                    if (!allowed) return
                                }
                                previewInvoiceImage()
                            }}
                        >
                            Preview PDF
                        </Button>
                        <Button onClick={handleDownload} disabled={isDownloading || !canExport}>
                            {isDownloading ? "Preparing PDF..." : "Download PDF"}
                        </Button>
                    </div>
                </section>
            ) : null}
        </Card>
    )
}
