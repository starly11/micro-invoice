import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { subscribeNewsletterApi } from "../api/public"
import { toast } from "sonner"

export default function Footer() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return
        setIsSubmitting(true)
        try {
            await subscribeNewsletterApi({ email, source: "footer" })
            toast.success("You're subscribed. Thanks for joining early.")
            setEmail("")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to subscribe")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <footer className="bg-background border-t border-muted/20 py-8">
            <div className="mx-auto max-w-7xl px-6 space-y-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm">
                        Want updates when new templates drop?
                        <div className="text-xs text-muted-foreground">No spam. One useful update at a time.</div>
                    </div>
                    <div className="flex w-full max-w-md gap-2">
                        <input
                            className="h-9 flex-1 rounded-md border border-input bg-white px-3 text-sm"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Notify Me"}
                        </Button>
                    </div>
                </form>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Left: Copyright */}
                <div className="text-sm text-muted-foreground">
                    © 2026 Micro Invoice
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link className="hover:text-foreground" to="/terms">Terms</Link>
                    <Link className="hover:text-foreground" to="/privacy">Privacy</Link>
                    <span className="hidden sm:inline">•</span>
                    <span>Built by Starly</span>
                </div>
            </div>
            </div>
        </footer>
    )
}
