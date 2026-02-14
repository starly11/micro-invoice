import { api } from "@/api/axios";

export const submitFeedbackApi = async (payload) => {
    const { data } = await api.post("/public/feedback", payload);
    return data;
};

export const subscribeNewsletterApi = async (payload) => {
    const { data } = await api.post("/public/newsletter", payload);
    return data;
};

export const trackPublicActivityApi = async (payload) => {
    const { data } = await api.post("/public/activity", payload);
    return data;
};

export const getPublicStatsApi = async () => {
    const { data } = await api.get("/public/stats");
    return data;
};

export const getPublicActivityApi = async (limit = 5) => {
    const { data } = await api.get(`/public/activity?limit=${limit}`);
    return data;
};

export const getRecentFeedbackApi = async (limit = 5) => {
    const { data } = await api.get(`/public/feedback/recent?limit=${limit}`);
    return data;
};
