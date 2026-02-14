import { Button } from "@/components/ui/button"
import { useInvoiceStore } from "../../auth/store/invoiceStore"
import { LineItemRow } from "./LineItemRow"

export function LineItems() {
    const items = useInvoiceStore((s) => s.invoice.items)
    const addItem = useInvoiceStore((s) => s.addItem)

    return (
        <div className="space-y-4">
            <div className="text-sm font-semibold text-slate-700">
                Line Items
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <LineItemRow key={item.id} item={item} />
                ))}
            </div>

            <Button variant="outline" onClick={addItem}>
                + Add Item
            </Button>
        </div>
    )
}
