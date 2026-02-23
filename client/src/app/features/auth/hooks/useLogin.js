import { useAuthStore } from "../store/authStore";
import { loginApi } from '../api/login'
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth)

    return useMutation({
        mutationFn: loginApi,

        onSuccess: ({ user, token }) => { setAuth({ user, token }) }
    })
}
