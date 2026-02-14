import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "../../invoice-genrator/utils/formatCurrency"
import { useClients } from "../../client/hooks/useClients"
import { useCreateClient } from "../../client/hooks/useCreateClient"
import { useUpdateClient } from "../../client/hooks/useUpdateClient"
import { useDeleteClient } from "../../client/hooks/useDeleteClient"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export function ClientsPage() {
    const [search, setSearch] = useState("")
    const page = 1
    const limit = 50
    const { data, isLoading, isError, refetch } = useClients({ page, limit, search })
    const createMutation = useCreateClient()
    const updateMutation = useUpdateClient()
    const deleteMutation = useDeleteClient()
    const rows = Array.isArray(data?.items) ? data.items : []

    if (isLoading) return <div className="p-6"><Spinner label="Loading clients..." /></div>
    if (isError) {
        return (
            <div className="p-6 space-y-3">
                <div className="text-sm text-red-600">Failed to load clients.</div>
                <Button variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-semibold">Your Clients</h1>
                <div className="flex items-center gap-2">
                    <input
                        className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        onClick={async () => {
                            const name = window.prompt("Client name")
                            if (!name) return
                            const email = window.prompt("Client email (optional)") || ""
                            try {
                                await createMutation.mutateAsync({ name, email })
                                toast.success("Client added")
                            } catch (error) {
                                toast.error(error?.message || "Failed to add client")
                            }
                        }}
                    >
                        + Add Client
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border p-4 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Client Name</th>
                            <th className="text-left py-2">Email</th>
                            <th className="text-left py-2">Invoices</th>
                            <th className="text-left py-2">Total Owed</th>
                            <th className="text-right py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row._id} className="border-b">
                                <td className="py-2">{row.name}</td>
                                <td className="py-2">{row.email}</td>
                                <td className="py-2">{row?.stats?.invoices || 0}</td>
                                <td className="py-2">{formatCurrency(row?.stats?.totalOwed || 0)}</td>
                                <td className="py-2 text-right space-x-2">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const name = window.prompt("Client name", row.name)
                                            if (!name) return
                                            const email = window.prompt("Client email", row.email || "") || ""
                                            try {
                                                await updateMutation.mutateAsync({
                                                    id: row._id,
                                                    payload: { ...row, name, email },
                                                })
                                                toast.success("Client updated")
                                            } catch (error) {
                                                toast.error(error?.message || "Failed to update client")
                                            }
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!window.confirm("Delete this client?")) return
                                            try {
                                                await deleteMutation.mutateAsync(row._id)
                                                toast.success("Client deleted")
                                            } catch (error) {
                                                toast.error(error?.message || "Failed to delete client")
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-3">No clients found.</div>
                ) : null}
            </div>
        </div>
    )
}
