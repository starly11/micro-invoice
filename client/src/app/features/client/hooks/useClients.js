import { useQuery } from "@tanstack/react-query"
import { getClients } from "../api/clients"

export function useClients({ page = 1, limit = 20, search = "" } = {}) {
    return useQuery({
        queryKey: ["clients", page, limit, search],
        queryFn: () => getClients({ page, limit, search }),
    })
}
