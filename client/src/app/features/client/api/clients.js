const BASE_URL = "/api/clients"

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
        throw error
    }
    if (response.status === 204) return null
    return response.json()
}

export async function getClients({ page = 1, limit = 20, search = "" } = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: String(search || ""),
    })
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        credentials: "include",
    })
    return handleResponse(response)
}

export async function createClient(payload) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    })
    return handleResponse(response)
}

export async function updateClient(id, payload) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    })
    return handleResponse(response)
}

export async function deleteClient(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
    return handleResponse(response)
}
