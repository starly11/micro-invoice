import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useSignup } from "../hooks/useSignup"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export const SignupForm = () => {
    const navigate = useNavigate()
    const { mutate, isPending } = useSignup()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const password = watch("password")

    const onSubmit = (data) => {
        mutate(
            {
                name: data.name,
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    toast.success("Account created")
                    navigate("/dashboard")
                },
                onError: (err) => {
                    toast.error(
                        err?.response?.data?.message || "Signup failed"
                    );
                },
            }
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                placeholder="John"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                {...register("email", {
                                    required: "Email is required",
                                })}
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
                                    minLength: {
                                        value: 6,
                                        message: "Min 6 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                {...register("confirmPassword", {
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button className="w-full" disabled={isPending}>
                            {isPending ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
