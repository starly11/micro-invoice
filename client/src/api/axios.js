import axios from 'axios'

const baseURL = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL || '/api')

export const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
})
