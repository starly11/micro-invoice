import { api } from '../../../../api/axios'

export const loginApi = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    return {
        user: res.data.user,
        token: res.data.token,
    }
}
