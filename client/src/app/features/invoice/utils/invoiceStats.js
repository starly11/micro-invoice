import { formatCurrency } from "../../invoice-genrator/utils/formatCurrency"

export function getInvoiceStats(invoices, currency = "USD") {
    const safeInvoices = Array.isArray(invoices) ? invoices : []

    const totalInvoices = safeInvoices.length
    const unpaid = safeInvoices.filter((invoice) => invoice?.status === "unpaid")
    const unpaidCount = unpaid.length

    const totalOwedRaw = unpaid.reduce((sum, invoice) => sum + Number(invoice?.total || 0), 0)
    const totalOwed = formatCurrency(totalOwedRaw, currency)

    return { totalInvoices, unpaidCount, totalOwed }
}
