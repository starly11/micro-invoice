import { api } from "@/api/axios"

export const logoutApi = async () => {
    const res = await api.post("/auth/logout")
    localStorage.removeItem('token')
    return res.data
}
