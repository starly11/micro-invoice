import axios from 'axios'

const configuredBaseURL = String(import.meta.env.VITE_API_URL || '').trim()

// In production on Vercel, always hit same-origin /api so cookies are first-party.
const baseURL = import.meta.env.PROD
    ? '/api'
    : (configuredBaseURL || '/api')

export const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
})
