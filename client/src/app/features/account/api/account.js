import { api } from "@/api/axios"

export const updateProfileApi = async (payload) => {
    const { data } = await api.patch("/auth/profile", payload)
    return data.user
}

export const changePasswordApi = async (payload) => {
    const { data } = await api.patch("/auth/password", payload)
    return data
}

export const updateBusinessApi = async (payload) => {
    const { data } = await api.patch("/auth/business", payload)
    return data.user
}

export const deleteAccountApi = async () => {
    const { data } = await api.delete("/auth/account")
    return data
}
