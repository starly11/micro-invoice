import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getMeApi } from "../api/getMe";
import { useAuthStore } from "../store/authStore";

export const AuthCallback = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const hydrateUser = async () => {
            try {
                const user = await getMeApi();

                if (!user) {
                    throw new Error("Authentication failed");
                }

                setUser(user);
                toast.success("Logged in successfully");
                navigate("/dashboard", { replace: true });
            } catch (err) {
                toast.error("Authentication failed. Please login again.");
                navigate("/login", { replace: true });
            }
        };

        hydrateUser();
    }, [navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Signing you in...</p>
        </div>
    );
};
