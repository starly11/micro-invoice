import { api } from '../../../../api/axios'

export const loginApi = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    const { user, token } = res.data
    if (token) {
        localStorage.setItem('token', token)
    }
    return user
}
