import { Outlet, Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/app/features/auth/store/authStore"
import { logoutApi } from "@/app/features/auth/api/logout"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { submitFeedbackApi } from "@/app/features/marketing/api/public"
import { Loader2 } from "lucide-react"

export function AppLayout() {
    const logout = useAuthStore((s) => s.logout)
    const user = useAuthStore((s) => s.user)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [openFeedback, setOpenFeedback] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [feedbackEmail, setFeedbackEmail] = useState(user?.email || "")
    const [isSendingFeedback, setIsSendingFeedback] = useState(false)

    const handleLogout = async () => {
        try {
            await logoutApi()
        } catch {
            // Clear local auth state even if server call fails.
        } finally {
            queryClient.setQueryData(["me"], null)
            queryClient.removeQueries({ queryKey: ["me"] })
            logout()
            navigate("/login")
            toast.success("Logged out")
        }
    }

    const handleFeedbackSubmit = async () => {
        if (!feedbackMessage.trim()) return
        setIsSendingFeedback(true)
        try {
            await submitFeedbackApi({
                type: "dashboard_widget",
                message: feedbackMessage,
                email: feedbackEmail,
                context: "protected-layout",
            })
            toast.success("Feedback sent")
            setFeedbackMessage("")
            setOpenFeedback(false)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send feedback")
        } finally {
            setIsSendingFeedback(false)
        }
    }

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="font-semibold">
                            Micro Invoice
                        </Link>
                        <nav className="flex items-center gap-4 text-sm">
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/invoices">Invoices</Link>
                            <Link to="/clients">Clients</Link>
                            <Link to="/account">Account</Link>
                            <Link to="/feedback">Feedback</Link>
                        </nav>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-6 py-6">
                <Outlet />
            </main>
            <button
                type="button"
                onClick={() => setOpenFeedback(true)}
                className="fixed bottom-5 right-5 rounded-full border bg-white px-4 py-2 text-sm shadow"
            >
                Feedback
            </button>
            {openFeedback ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 space-y-3">
                        <h3 className="text-lg font-semibold">Message Me Directly</h3>
                        <p className="text-sm text-slate-600">Share bug reports, feature ideas, or workflow pain points.</p>
                        <textarea
                            className="min-h-[120px] w-full rounded-md border border-input p-2 text-sm"
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            placeholder="Your message"
                        />
                        <input
                            className="h-9 w-full rounded-md border border-input px-3 text-sm"
                            value={feedbackEmail}
                            onChange={(e) => setFeedbackEmail(e.target.value)}
                            placeholder="Your email for reply"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOpenFeedback(false)}>Cancel</Button>
                            <Button onClick={handleFeedbackSubmit} disabled={isSendingFeedback}>
                                {isSendingFeedback ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : "Send"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
