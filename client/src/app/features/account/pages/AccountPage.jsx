import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../auth/store/authStore"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { useCreateCheckoutSession } from "../../billing/hooks/useCreateCheckoutSession"
import {
    useUpdateProfile,
    useChangePassword,
    useUpdateBusiness,
    useDeleteAccount,
} from "../hooks/useAccountMutations"
import { toast } from "sonner"

const MAX_LOGO_FILE_SIZE_BYTES = 2 * 1024 * 1024

export function AccountPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const user = useAuthStore((s) => s.user)
    const setUser = useAuthStore((s) => s.setUser)
    const logout = useAuthStore((s) => s.logout)
    const { mutateAsync: createCheckout, isPending } = useCreateCheckoutSession()
    const updateProfile = useUpdateProfile()
    const changePassword = useChangePassword()
    const updateBusiness = useUpdateBusiness()
    const deleteAccount = useDeleteAccount()
    const isPro = user?.plan === "pro"
    const configuredPaymentMode = String(import.meta.env.VITE_PAYMENT_MODE || "mock").toLowerCase()
    const showDemoPaymentBadge = configuredPaymentMode !== "stripe"
    const [activeTab, setActiveTab] = useState("profile")
    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
    })
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    })
    const [businessForm, setBusinessForm] = useState({
        name: user?.business?.name || "",
        email: user?.business?.email || "",
        phone: user?.business?.phone || "",
        addressLine1: user?.business?.addressLine1 || "",
        addressLine2: user?.business?.addressLine2 || "",
        cityStateZip: user?.business?.cityStateZip || "",
        country: user?.business?.country || "USA",
        logoUrl: user?.business?.logoUrl || "",
        defaultCurrency: user?.business?.defaultCurrency || "USD",
        defaultTaxRate: Number(user?.business?.defaultTaxRate || 0),
    })
    const paidText = useMemo(
        () => (user?.paidAt ? new Date(user.paidAt).toLocaleDateString() : "N/A"),
        [user?.paidAt]
    )

    const handleUpgrade = async () => {
        try {
            const { url, mode } = await createCheckout()
            if (mode === "mock") {
                toast.message("Demo payment mode enabled.")
            }
            if (url) window.location.href = url
        } catch (error) {
            toast.error(error?.response?.data?.message || "Checkout failed")
        }
    }

    return (
        <div className="space-y-5">
            <h1 className="text-xl font-semibold">Account Settings</h1>
            <div className="flex items-center gap-2 border-b pb-3">
                <Button variant={activeTab === "profile" ? "default" : "outline"} onClick={() => setActiveTab("profile")}>Profile</Button>
                <Button variant={activeTab === "business" ? "default" : "outline"} onClick={() => setActiveTab("business")}>Business Details</Button>
                <Button variant={activeTab === "subscription" ? "default" : "outline"} onClick={() => setActiveTab("subscription")}>Subscription</Button>
            </div>

            {activeTab === "profile" && (
                <div className="max-w-2xl space-y-4 rounded-lg border p-4">
                    <div className="grid gap-3">
                        <label className="text-sm">Name</label>
                        <input
                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <label className="text-sm">Email</label>
                        <input
                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                        />
                        <div className="text-xs text-slate-500">verified ✓</div>
                    </div>

                    <div className="grid gap-3 border-t pt-4">
                        <div className="font-medium text-sm">Change Password</div>
                        <input
                            type="password"
                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                            placeholder="Current Password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        />
                        <input
                            type="password"
                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                            placeholder="New Password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        />
                    </div>

                    <Button
                        onClick={async () => {
                            try {
                                const updated = await updateProfile.mutateAsync(profileForm)
                                setUser(updated)
                                toast.success("Profile updated")
                                if (passwordForm.currentPassword && passwordForm.newPassword) {
                                    await changePassword.mutateAsync(passwordForm)
                                    setPasswordForm({ currentPassword: "", newPassword: "" })
                                    toast.success("Password updated")
                                }
                            } catch (error) {
                                toast.error(error?.response?.data?.message || "Update failed")
                            }
                        }}
                    >
                        Update Profile
                    </Button>
                </div>
            )}

            {activeTab === "business" && (
                <div className="max-w-2xl space-y-4 rounded-lg border p-4">
                    <div className="text-sm text-slate-600">Your Business Information (Used on all invoices)</div>
                    <div className="grid gap-3">
                        <input className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="Business Name *" value={businessForm.name} onChange={(e) => setBusinessForm((p) => ({ ...p, name: e.target.value }))} />
                        <input className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="Email *" value={businessForm.email} onChange={(e) => setBusinessForm((p) => ({ ...p, email: e.target.value }))} />
                        <input className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="Phone" value={businessForm.phone} onChange={(e) => setBusinessForm((p) => ({ ...p, phone: e.target.value }))} />
                        <input className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="Address line 1" value={businessForm.addressLine1} onChange={(e) => setBusinessForm((p) => ({ ...p, addressLine1: e.target.value }))} />
                        <input className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="Address line 2" value={businessForm.addressLine2} onChange={(e) => setBusinessForm((p) => ({ ...p, addressLine2: e.target.value }))} />
                        <input className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="City, State, ZIP" value={businessForm.cityStateZip} onChange={(e) => setBusinessForm((p) => ({ ...p, cityStateZip: e.target.value }))} />
                        <div className="grid grid-cols-2 gap-3">
                            <select className="h-9 rounded-md border border-input bg-white px-3 text-sm" value={businessForm.defaultCurrency} onChange={(e) => setBusinessForm((p) => ({ ...p, defaultCurrency: e.target.value }))}>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                            </select>
                            <input type="number" className="h-9 rounded-md border border-input bg-white px-3 text-sm" placeholder="Default Tax Rate (%)" value={businessForm.defaultTaxRate} onChange={(e) => setBusinessForm((p) => ({ ...p, defaultTaxRate: Number(e.target.value || 0) }))} />
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm">Logo</div>
                            {businessForm.logoUrl ? <img src={businessForm.logoUrl} alt="Business logo" className="h-14 w-auto border rounded" /> : null}
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        if (file.size > MAX_LOGO_FILE_SIZE_BYTES) {
                                            toast.error("Logo is too large. Please upload an image under 2MB.")
                                            return
                                        }
                                        const reader = new FileReader()
                                        reader.onload = () => {
                                            setBusinessForm((p) => ({ ...p, logoUrl: String(reader.result || "") }))
                                        }
                                        reader.readAsDataURL(file)
                                    }}
                                />
                                <Button variant="outline" onClick={() => setBusinessForm((p) => ({ ...p, logoUrl: "" }))}>Remove</Button>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={async () => {
                            try {
                                const updated = await updateBusiness.mutateAsync(businessForm)
                                setUser(updated)
                                toast.success("Business details saved")
                            } catch (error) {
                                toast.error(error?.response?.data?.message || "Save failed")
                            }
                        }}
                    >
                        Save Business Details
                    </Button>
                </div>
            )}

            {activeTab === "subscription" && (
                <div className="max-w-2xl space-y-4 rounded-lg border p-4">
                    {showDemoPaymentBadge ? (
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            Demo payment mode is active. Upgrade flow runs without Stripe for showcase purposes.
                        </div>
                    ) : null}
                    <div className="space-y-1 text-sm">
                        <div><span className="font-semibold">Plan:</span> {isPro ? "Unlimited ✓" : "Free"}</div>
                        <div><span className="font-semibold">Paid:</span> {isPro ? "$5.00 (one-time)" : "N/A"}</div>
                        <div><span className="font-semibold">Status:</span> {isPro ? "Active" : "Free Tier"}</div>
                        <div><span className="font-semibold">Paid At:</span> {paidText}</div>
                        <div className="text-slate-600 pt-2">
                            {isPro ? "You have lifetime access to all features." : "Upgrade to remove limits."}
                        </div>
                    </div>

                    {!isPro ? (
                        <Button onClick={handleUpgrade} disabled={isPending}>
                            Remove Limits - $5
                        </Button>
                    ) : null}

                    <div className="border-t pt-4 space-y-2">
                        <div className="font-semibold text-sm">Danger Zone</div>
                        <div className="text-sm text-slate-600">
                            Delete Account. This permanently deletes your account and all invoices.
                        </div>
                        <Button
                            variant="ghost"
                            onClick={async () => {
                                if (!window.confirm("Delete your account permanently?")) return
                                try {
                                    await deleteAccount.mutateAsync()
                                    queryClient.setQueryData(["me"], null)
                                    queryClient.removeQueries({ queryKey: ["me"] })
                                    logout()
                                    navigate("/")
                                } catch (error) {
                                    toast.error(error?.response?.data?.message || "Delete failed")
                                }
                            }}
                        >
                            Delete My Account
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
