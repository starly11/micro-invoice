import { api } from "../../../../api/axios";
import { getStoredToken } from "./tokenStorage";

export const getMeApi = async () => {
    if (!getStoredToken()) return null;

    try {
        const res = await api.get("/auth/me");
        return res.data.user || null;
    } catch (error) {
        // If unauthorized, return null
        if (error.response && error.response.status === 401) {
            return null;
        }

        throw error;
    }
};
