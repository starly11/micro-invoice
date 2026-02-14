import jsPDF from "jspdf"
import { formatCurrency } from "../../invoice-genrator/utils/formatCurrency"

export function downloadInvoiceDataPdf(invoice) {
    if (!invoice) return

    const pdf = new jsPDF({ unit: "pt", format: "a4" })
    const left = 48
    let y = 52

    const line = (text, gap = 18) => {
        pdf.text(String(text || ""), left, y)
        y += gap
    }

    const number = invoice?.meta?.invoiceNumber || "INV"
    const currency = invoice?.currency || "USD"
    const items = Array.isArray(invoice?.items) ? invoice.items : []

    line(`Invoice #${number}`, 24)
    line(`Status: ${invoice?.status || "unpaid"}`)
    line(`Issued: ${invoice?.meta?.issueDate || ""}`)
    line(`Due: ${invoice?.meta?.dueDate || ""}`, 24)

    line(`Business: ${invoice?.business?.name || ""}`)
    line(`Client: ${invoice?.client?.name || ""}`, 24)

    line("Items", 16)
    pdf.setFontSize(10)
    for (const item of items) {
        const amount = Number(item?.quantity || 0) * Number(item?.rate || 0)
        line(
            `${item?.description || "Untitled"} | Qty ${item?.quantity || 0} | Rate ${formatCurrency(item?.rate || 0, currency)} | Amount ${formatCurrency(amount, currency)}`,
            14
        )
        if (y > 740) {
            pdf.addPage()
            y = 52
        }
    }
    pdf.setFontSize(12)
    y += 8
    line(`Subtotal: ${formatCurrency(invoice?.subtotal || 0, currency)}`)
    line(`Tax: ${formatCurrency(invoice?.tax || 0, currency)}`)
    line(`Total: ${formatCurrency(invoice?.total || 0, currency)}`, 24)
    line(`Notes: ${invoice?.notes || ""}`)

    pdf.save(`Invoice-${number}.pdf`)
}
