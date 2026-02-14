import { useQuery } from "@tanstack/react-query"
import { getInvoice } from "../api/invoices"

export function useInvoice(id) {
    return useQuery({
        queryKey: ["invoices", id],
        queryFn: () => getInvoice(id),
        enabled: Boolean(id),
    })
}
