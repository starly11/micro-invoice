import { api } from "@/api/axios";

export const signupApi = async (data) => {
    const res = await api.post('/auth/signup', data, {
        withCredentials: true,
    })
    return res.data.user
}
