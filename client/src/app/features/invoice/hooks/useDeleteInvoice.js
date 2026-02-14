import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteInvoice } from "../api/invoices"

export function useDeleteInvoice({ queryKey = ["invoices"] } = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteInvoice,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey })
            const previous = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, (old) => {
                if (Array.isArray(old)) {
                    return old.filter((invoice) => (invoice?._id || invoice?.id) !== id)
                }
                if (old && Array.isArray(old.items)) {
                    return {
                        ...old,
                        items: old.items.filter((invoice) => (invoice?._id || invoice?.id) !== id),
                    }
                }
                return old
            })

            return { previous }
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
        },
    })
}
