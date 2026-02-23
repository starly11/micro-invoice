import axios from 'axios'

const baseURL = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL || '/api')

export const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
})

// Attach JWT from localStorage on every request (works cross-domain, unlike cookies)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})
