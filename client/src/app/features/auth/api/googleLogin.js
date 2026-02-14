import { api } from "@/api/axios";

export const googleLoginApi = () => {
    const baseURL =
        api?.defaults?.baseURL || "http://localhost:3000/api";
    window.location.href = `${baseURL}/auth/google`;
};
