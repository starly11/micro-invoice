import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLogin } from "../hooks/useLogin";
import { googleLoginApi } from "../api/googleLogin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const LoginForm = () => {
    const navigate = useNavigate();
    const { mutate, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Logged in successfully");
                navigate("/dashboard");
            },
            onError: (err) => {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Login failed";
                toast.error(message);
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                {...register("email", { required: "Email is required" })}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button className="w-full" disabled={isPending}>
                            {isPending ? "Signing in..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={googleLoginApi}
                        >
                            Continue with Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
