import { api } from "@/api/axios";

export const signupApi = async (data) => {
    const res = await api.post('/auth/signup', data)
    return {
        user: res.data.user,
        token: res.data.token,
    }
}
