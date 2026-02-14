import { useMutation } from "@tanstack/react-query"
import { createCheckoutSessionApi } from "../api/createCheckoutSession"

export const useCreateCheckoutSession = () =>
    useMutation({
        mutationFn: createCheckoutSessionApi,
    })
