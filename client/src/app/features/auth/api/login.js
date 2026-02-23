import { api } from '../../../../api/axios'

export const loginApi = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    return res.data.user
}
