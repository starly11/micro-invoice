import { api } from "@/api/axios";

export const signupApi = async (data) => {
    const res = await api.post('/auth/signup', data)
    const { user, token } = res.data
    if (token) {
        localStorage.setItem('token', token)
    }
    return user
}
