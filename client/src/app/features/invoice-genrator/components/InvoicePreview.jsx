import { useMemo } from "react"
import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { selectPreviewItems } from "../utils/invoiceSelector"
import { templates } from "../utils/templates"
import { cn } from "@/lib/utils"
import { Totals } from "./InvoiceTotals"
import { useAuthStore } from "../../auth/store/authStore"

export default function InvoicePreview() {
  const templateKey = useInvoiceStore((state) => state.template)
  const template = templates[templateKey] || templates.classic
  const user = useAuthStore((state) => state.user)

  const businessName = useInvoiceStore((state) => state.invoice.business.name)
  const businessEmail = useInvoiceStore((state) => state.invoice.business.email)
  const businessPhone = useInvoiceStore((state) => state.invoice.business.phone)
  const businessAddressLine1 = useInvoiceStore((state) => state.invoice.business.addressLine1)
  const businessAddressLine2 = useInvoiceStore((state) => state.invoice.business.addressLine2)
  const businessCityStateZip = useInvoiceStore((state) => state.invoice.business.cityStateZip)
  const businessLogoUrl = useInvoiceStore((state) => state.invoice.business.logoUrl)
  const clientName = useInvoiceStore((state) => state.invoice.client.name)
  const clientEmail = useInvoiceStore((state) => state.invoice.client.email)
  const clientAddressLine1 = useInvoiceStore((state) => state.invoice.client.addressLine1)
  const clientAddressLine2 = useInvoiceStore((state) => state.invoice.client.addressLine2)
  const clientCityStateZip = useInvoiceStore((state) => state.invoice.client.cityStateZip)
  const invoiceNumber = useInvoiceStore((state) => state.invoice.meta.invoiceNumber)
  const issueDate = useInvoiceStore((state) => state.invoice.meta.issueDate)
  const dueDate = useInvoiceStore((state) => state.invoice.meta.dueDate)
  const notes = useInvoiceStore((state) => state.invoice.notes)
  const currency = useInvoiceStore((state) => state.invoice.currency)
  const taxRate = useInvoiceStore((state) => state.invoice.taxRate)
  const rawItems = useInvoiceStore((state) => state.invoice.items)
  const items = useMemo(() => selectPreviewItems(rawItems, currency), [rawItems, currency])

  const businessNameText = businessName || "Your Business Name"
  const businessNameClass = businessName ? "text-slate-900" : "text-slate-400 italic"
  const businessAddressLine1Text = businessAddressLine1 || "123 Business St"
  const businessAddressLine1Class = businessAddressLine1 ? "text-slate-600" : "text-slate-400 italic"
  const businessAddressLine2Text = businessAddressLine2 || ""
  const businessAddressLine2Class = businessAddressLine2 ? "text-slate-600" : "text-slate-400 italic"
  const businessCityStateZipText = businessCityStateZip || "City, State ZIP"
  const businessCityStateZipClass = businessCityStateZip ? "text-slate-600" : "text-slate-400 italic"
  const businessEmailText = businessEmail || "hello@company.com"
  const businessEmailClass = businessEmail ? "text-slate-600" : "text-slate-400 italic"
  const businessPhoneText = businessPhone || "555-123-4567"
  const businessPhoneClass = businessPhone ? "text-slate-600" : "text-slate-400 italic"
  const clientNameText = clientName || "Client Name"
  const clientNameClass = clientName ? "text-slate-900" : "text-slate-400 italic"
  const clientEmailText = clientEmail || "client@email.com"
  const clientEmailClass = clientEmail ? "text-slate-600" : "text-slate-400 italic"
  const clientAddressLine1Text = clientAddressLine1 || "456 Client Ave"
  const clientAddressLine1Class = clientAddressLine1 ? "text-slate-600" : "text-slate-400 italic"
  const clientAddressLine2Text = clientAddressLine2 || ""
  const clientAddressLine2Class = clientAddressLine2 ? "text-slate-600" : "text-slate-400 italic"
  const clientCityStateZipText = clientCityStateZip || "City, State ZIP"
  const clientCityStateZipClass = clientCityStateZip ? "text-slate-600" : "text-slate-400 italic"
  const notesText = notes || "Notes go here..."
  const notesClass = notes ? "text-slate-500" : "text-slate-400 italic"
  const showWatermark = user?.plan !== "pro"

  return (
    <div id="invoice-print-root">
      {/* Tailwind safelist for template classes */}
      <div className="hidden font-sans font-serif border-b border-gray-300 pb-4 bg-gray-900 text-white p-4 space-y-4 space-y-5 space-y-6 text-gray-900 text-gray-800" />
        <div
        id="invoice-preview"
        className={cn(
          "relative bg-white w-full max-w-[850px] mx-auto p-8 sm:p-10 lg:p-12",
          template.font,
          template.spacing
        )}
      >

        {/* HEADER */}
        <header className={cn("flex justify-between", template.header)}>
          <div>
            {businessLogoUrl ? (
              <img
                src={businessLogoUrl}
                alt="Business logo"
                className="h-12 w-auto mb-3 object-contain"
              />
            ) : (
              <div className="h-12 w-32 mb-3 border border-dashed border-slate-300 text-xs text-slate-400 flex items-center justify-center">
                Your Logo Here
              </div>
            )}
            <h1 className={cn("text-2xl font-bold", template.accent, businessNameClass)}>
              {businessNameText}
            </h1>
            <p className={cn("text-sm", businessEmailClass)}>{businessEmailText}</p>
            <p className={cn("text-sm", businessPhoneClass)}>{businessPhoneText}</p>
            <p className={cn("text-sm", businessAddressLine1Class)}>{businessAddressLine1Text}</p>
            {businessAddressLine2Text && (
              <p className={cn("text-sm", businessAddressLine2Class)}>{businessAddressLine2Text}</p>
            )}
            <p className={cn("text-sm", businessCityStateZipClass)}>{businessCityStateZipText}</p>
          </div>
          <div className="text-right">
            <h2 className={cn("text-3xl font-semibold uppercase", template.accent)}>
              Invoice
            </h2>
            <p className="text-sm text-slate-600 mt-2">#{invoiceNumber || "INV-001"}</p>
          </div>
        </header>

        {/* CLIENT + META */}
        <section className="flex justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500 mb-1 font-bold">Bill To</p>
            <p className={cn("font-medium", clientNameClass)}>{clientNameText}</p>
            <p className={cn("text-sm", clientEmailClass)}>{clientEmailText}</p>
            <p className={cn("text-sm", clientAddressLine1Class)}>{clientAddressLine1Text}</p>
            {clientAddressLine2Text && (
              <p className={cn("text-sm", clientAddressLine2Class)}>{clientAddressLine2Text}</p>
            )}
            <p className={cn("text-sm", clientCityStateZipClass)}>{clientCityStateZipText}</p>
          </div>
          <div className="text-sm text-right">
            <p><span className="text-slate-500">Issued:</span> {issueDate}</p>
            <p><span className="text-slate-500">Due:</span> {dueDate || "N/A"}</p>
            <p><span className="text-slate-500">Currency:</span> {currency}</p>
          </div>
        </section>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Rate</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-50">
                <td className="py-4">{item.description || "Untitled Item"}</td>
                <td className="py-4 text-right">{item.quantity}</td>
                <td className="py-4 text-right">{item.rateFormatted}</td>
                <td className="py-4 text-right font-medium">
                  {item.amountFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <Totals />

        <div className={cn("text-sm border-t pt-4", notesClass)}>
          <span className="font-semibold text-slate-700">Notes: </span>
          {notesText}
        </div>

        {showWatermark ? (
          <div className="mt-8 text-xs text-slate-400 border-t pt-3">
            Generated with MicroInvoice
          </div>
        ) : null}
      </div>
    </div>
  )
}
