import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { useInvoiceTotals } from "../hooks/useInvoiceTotal"
import { formatCurrency } from "../utils/formatCurrency"

export function Totals() {
    const { subtotal, tax, total, currency } = useInvoiceTotals()
    const taxRate = useInvoiceStore((s) => s.invoice.taxRate)

    return (
        <div className="w-64 ml-auto space-y-2 text-sm">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
                <span>Tax ({taxRate || 0}%)</span>
                <span>{formatCurrency(tax, currency)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
            </div>
        </div>
    )
}
