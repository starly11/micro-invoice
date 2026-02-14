import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateInvoice } from "../api/invoices"

export function useUpdateInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }) => updateInvoice(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["invoices", variables.id] })
            }
        },
    })
}
