import { api } from "@/api/axios"

export const createCheckoutSessionApi = async () => {
    const response = await api.post("/billing/checkout-session")
    if (!response?.data?.url) {
        throw new Error("Checkout URL missing from server response")
    }
    return {
        url: response.data.url,
        mode: response.data.mode || "stripe",
        message: response.data.message || "",
    }
}
