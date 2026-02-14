import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useInvoiceStore } from "../../auth/store/invoiceStore"

export function LineItemRow({ item }) {
    const updateItem = useInvoiceStore((s) => s.updateItem)
    const removeItem = useInvoiceStore((s) => s.removeItem)

    const amount = item.quantity * item.rate

    return (
        <div className="grid grid-cols-12 gap-2 items-center">

            {/* Description */}
            <Input
                className="col-span-6"
                placeholder="Service description"
                value={item.description}
                onChange={(e) =>
                    updateItem(item.id, { description: e.target.value })
                }
            />

            {/* Qty */}
            <Input
                className="col-span-2"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                    updateItem(item.id, { quantity: Number(e.target.value) })
                }
            />

            {/* Rate */}
            <Input
                className="col-span-2"
                type="number"
                min="0"
                value={item.rate}
                onChange={(e) =>
                    updateItem(item.id, { rate: Number(e.target.value) })
                }
            />

            {/* Amount (read-only, calculated) */}
            <div className="col-span-1 text-right text-sm text-slate-700">
                {amount.toFixed(2)}
            </div>

            {/* Remove */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
            >
                ✕
            </Button>
        </div>
    )
}
