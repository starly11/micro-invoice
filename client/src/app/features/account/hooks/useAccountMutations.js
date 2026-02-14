import { useMutation } from "@tanstack/react-query"
import {
    updateProfileApi,
    changePasswordApi,
    updateBusinessApi,
    deleteAccountApi,
} from "../api/account"

export const useUpdateProfile = () =>
    useMutation({
        mutationFn: updateProfileApi,
    })

export const useChangePassword = () =>
    useMutation({
        mutationFn: changePasswordApi,
    })

export const useUpdateBusiness = () =>
    useMutation({
        mutationFn: updateBusinessApi,
    })

export const useDeleteAccount = () =>
    useMutation({
        mutationFn: deleteAccountApi,
    })
