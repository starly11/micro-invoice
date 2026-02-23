import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../api/signup";
import { useAuthStore } from "../store/authStore";

export const useSignup = () => {
    const setAuth = useAuthStore((state) => state.setAuth)

    return useMutation({
        mutationFn: signupApi,
        onSuccess: ({ user, token }) => { setAuth({ user, token }) }

    })
}
