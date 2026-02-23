const TOKEN_KEY = "micro_invoice_auth_token";

export const getStoredToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token) => {
    if (typeof window === "undefined") return;
    if (!token) {
        localStorage.removeItem(TOKEN_KEY);
        return;
    }
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
};
