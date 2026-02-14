import { useAuthStore } from "../store/authStore";
import { loginApi } from '../api/login'
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: loginApi,

        onSuccess: (user) => { setUser(user) }
    })
}