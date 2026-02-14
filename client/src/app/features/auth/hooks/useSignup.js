import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../api/signup";
import { useAuthStore } from "../store/authStore";

export const useSignup = () => {
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: signupApi,
        onSuccess: (user) => { setUser(user) }

    })
}
