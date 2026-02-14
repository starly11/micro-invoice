import { formatCurrency } from "../../invoice-genrator/utils/formatCurrency"

const normalize = (value) =>
    String(value || "")
        .toLowerCase()
        .trim()

export function filterInvoices(invoices, { search = "", status = "all" } = {}) {
    const safeInvoices = Array.isArray(invoices) ? invoices : []
    const query = normalize(search)

    return safeInvoices.filter((invoice) => {
        if (status !== "all" && invoice?.status !== status) return false

        if (!query) return true

        const haystack = [
            invoice?.invoiceNumber,
            invoice?.clientName,
            invoice?.client?.name,
            invoice?.businessName,
            invoice?.business?.name,
        ]
            .map(normalize)
            .join(" ")

        return haystack.includes(query)
    })
}

export function getInvoiceRows(invoices, currency = "USD") {
    const safeInvoices = Array.isArray(invoices) ? invoices : []

    return safeInvoices.map((invoice) => ({
        id: invoice?.id || invoice?._id,
        number: invoice?.invoiceNumber || invoice?.meta?.invoiceNumber || "—",
        client: invoice?.clientName || invoice?.client?.name || "—",
        status: invoice?.status || "unknown",
        total: formatCurrency(invoice?.total ?? invoice?.amount ?? 0, currency),
        issued: invoice?.issueDate || invoice?.meta?.issueDate || "—",
        due: invoice?.dueDate || invoice?.meta?.dueDate || "—",
    }))
}
