import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useInvoices } from "../hooks/useInvoices"
import { useDeleteInvoice } from "../hooks/useDeleteInvoice"
import { filterInvoices, getInvoiceRows } from "../utils/invoiceFilters"
import { getInvoice } from "../api/invoices"
import { downloadInvoiceDataPdf } from "../utils/downloadInvoiceDataPdf"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export function InvoicesTableSection() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const page = 1
    const limit = 20
    const queryKey = ["invoices", page, limit]
    const { data, isLoading, isError, refetch } = useInvoices({ page, limit })
    const { mutate: deleteInvoice } = useDeleteInvoice({ queryKey })
    const invoices = Array.isArray(data?.items) ? data.items : []
    const filteredInvoices = useMemo(
        () => filterInvoices(invoices, { search, status }),
        [invoices, search, status]
    )
    const rows = useMemo(() => getInvoiceRows(filteredInvoices), [filteredInvoices])

    if (isLoading) return <div className="p-6"><Spinner label="Loading invoices..." /></div>
    if (isError) {
        return (
            <div className="p-6 space-y-3">
                <div className="text-sm text-red-600">Failed to load invoices.</div>
                <Button variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="rounded-lg border p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <Button asChild>
                    <Link to="/invoice/new">+ New Invoice</Link>
                </Button>
                <input
                    className="h-9 w-full max-w-sm rounded-md border border-input bg-white px-3 text-sm"
                    placeholder="Search invoices"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            {rows.length === 0 ? (
                <div className="text-sm text-muted-foreground">No invoices found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Invoice #</th>
                                <th className="text-left py-2">Client</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Due</th>
                                <th className="text-left py-2">Status</th>
                                <th className="text-right py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className="border-b">
                                    <td className="py-2">{row.number}</td>
                                    <td className="py-2">{row.client}</td>
                                    <td className="py-2">{row.total}</td>
                                    <td className="py-2">{row.issued}</td>
                                    <td className="py-2">{row.due}</td>
                                    <td className="py-2 capitalize">{row.status}</td>
                                    <td className="py-2 text-right space-x-2">
                                        <Link to={`/invoice/view/${row.id}`} className="text-sm">👁️</Link>
                                        <Link to={`/invoice/edit/${row.id}`} className="text-sm">✏️</Link>
                                        <button
                                            type="button"
                                            className="text-sm"
                                            onClick={async () => {
                                                try {
                                                    const invoice = await getInvoice(row.id)
                                                    downloadInvoiceDataPdf(invoice)
                                                } catch (error) {
                                                    toast.error(error?.message || "Download failed")
                                                }
                                            }}
                                        >
                                            📄
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm"
                                            onClick={() => deleteInvoice(row.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
