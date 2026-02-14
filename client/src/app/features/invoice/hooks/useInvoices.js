import { useQuery } from "@tanstack/react-query"
import { getInvoices } from "../api/invoices"

export function useInvoices({ page = 1, limit = 20 } = {}) {
    return useQuery({
        queryKey: ["invoices", page, limit],
        queryFn: () => getInvoices({ page, limit }),
    })
}
