import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateClient } from "../api/clients"

export function useUpdateClient() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }) => updateClient(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] })
        },
    })
}
