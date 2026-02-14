import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { selectSubtotal, selectTax, selectTotal } from "../utils/invoiceSelector"

export function useInvoiceTotals() {
    const items = useInvoiceStore((s) => s.invoice.items)
    const taxRate = useInvoiceStore((s) => s.invoice.taxRate)
    const currency = useInvoiceStore((s) => s.invoice.currency)

    const subtotal = selectSubtotal(items)
    const tax = selectTax(subtotal, taxRate)
    const total = selectTotal(subtotal, tax)

    return { subtotal, tax, total, currency }
}
