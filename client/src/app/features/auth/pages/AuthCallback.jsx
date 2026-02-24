import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getMeApi } from "../api/getMe";
import { useAuthStore } from "../store/authStore";
import { setStoredToken } from "../api/tokenStorage";

export const AuthCallback = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const hydrateUser = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");
                if (token) {
                    setStoredToken(token);
                }

                const user = await getMeApi();

                if (!user) {
                    throw new Error("Authentication failed");
                }

                setAuth({ user, token: token || null });
                toast.success("Logged in successfully");
                navigate("/dashboard", { replace: true });
            } catch (err) {
                logout();
                toast.error("Authentication failed. Please login again.");
                navigate("/login", { replace: true });
            }
        };

        hydrateUser();
    }, [navigate, setAuth, logout]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Signing you in...</p>
        </div>
    );
};
