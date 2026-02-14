const BASE_URL = "/api/invoices"

async function handleResponse(response) {
    if (!response.ok) {
        let payload = null
        const raw = await response.text()
        try {
            payload = raw ? JSON.parse(raw) : null
        } catch {
            payload = null
        }
        const message = payload?.message || raw || "Request failed"
        const error = new Error(message)
        error.status = response.status
        error.code = payload?.code
        throw error
    }
    if (response.status === 204) return null
    return response.json()
}

export async function getInvoices({ page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        credentials: "include",
    })
    return handleResponse(response)
}

export async function getInvoice(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        credentials: "include",
    })
    return handleResponse(response)
}

export async function createInvoice(payload) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    })
    return handleResponse(response)
}

export async function updateInvoice(id, payload) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    })
    return handleResponse(response)
}

export async function deleteInvoice(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
    return handleResponse(response)
}
