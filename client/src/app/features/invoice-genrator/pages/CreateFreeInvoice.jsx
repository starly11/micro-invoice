import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import InvoiceForm from "../components/InvoiceForm"
import InvoicePreview from "../components/InvoicePreview"
import { useAuthStore } from "../../auth/store/authStore"
import { useCreateCheckoutSession } from "../../billing/hooks/useCreateCheckoutSession"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { submitFeedbackApi } from "../../marketing/api/public"
import { trackPublicActivityApi } from "../../marketing/api/public"
import { useInvoiceStore } from "../../auth/store/invoiceStore"

const FREE_LIMIT = 3
const FREE_USAGE_KEY = "micro_invoice_free_used_v1"

const getStoredFreeUsage = () => {
    if (typeof window === "undefined") return 0
    const raw = window.localStorage.getItem(FREE_USAGE_KEY)
    const parsed = Number(raw || 0)
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
}

const getApproxLocation = () => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        return timezone.split("/").pop()?.replaceAll("_", " ") || "Unknown";
    } catch {
        return "Unknown";
    }
}

export default function CreateFreeInvoice() {
    const user = useAuthStore((s) => s.user)
    const businessName = useInvoiceStore((s) => s.invoice.business.name)
    const clientName = useInvoiceStore((s) => s.invoice.client.name)
    const items = useInvoiceStore((s) => s.invoice.items)
    const invoiceNumber = useInvoiceStore((s) => s.invoice.meta.invoiceNumber)
    const navigate = useNavigate()
    const { mutateAsync: createCheckout, isPending: isUpgrading } = useCreateCheckoutSession()
    const [freeUsed, setFreeUsed] = useState(getStoredFreeUsage)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [feedbackRating, setFeedbackRating] = useState("")
    const [feedbackText, setFeedbackText] = useState("")
    const [feedbackEmail, setFeedbackEmail] = useState(user?.email || "")
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
    const isAnonymous = !user
    const isFreeUser = user?.plan !== "pro"
    const remainingFree = useMemo(
        () => Math.max(0, FREE_LIMIT - freeUsed),
        [freeUsed]
    )
    const progress = useMemo(() => {
        const hasBusiness = Boolean(String(businessName || "").trim())
        const hasClient = Boolean(String(clientName || "").trim())
        const hasLineItem = Array.isArray(items) && items.some((item) => String(item?.description || "").trim())
        return {
            hasBusiness,
            hasClient,
            hasLineItem,
            step: hasBusiness ? (hasClient ? (hasLineItem ? 3 : 2) : 1) : 1,
        }
    }, [businessName, clientName, items])

    const handleUpgrade = async () => {
        if (!user) {
            navigate("/signup")
            return
        }
        try {
            const { url } = await createCheckout()
            if (url) {
                window.location.href = url
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to start checkout")
        }
    }

    const canExportInvoice = async () => {
        if (!isAnonymous) return true
        if (freeUsed < FREE_LIMIT) return true
        toast.error("Free limit reached. Sign up to continue.")
        navigate("/signup")
        return false
    }

    const onInvoiceExported = () => {
        const location = getApproxLocation()
        trackPublicActivityApi({
            action: "invoice_created",
            location,
            source: "create-free",
        }).catch(() => { })
        trackPublicActivityApi({
            action: "pdf_download",
            location,
            source: "create-free",
        }).catch(() => { })

        if (!isAnonymous) return
        const next = Math.min(FREE_LIMIT, freeUsed + 1)
        setFreeUsed(next)
        if (typeof window !== "undefined") {
            window.localStorage.setItem(FREE_USAGE_KEY, String(next))
        }
        setShowSuccessModal(true)
        if (next >= FREE_LIMIT) {
            toast.message("You used all free invoices. Create an account to continue.")
        }
    }

    const submitFeedback = async () => {
        if (!feedbackRating && !feedbackText.trim()) {
            setShowSuccessModal(false)
            return
        }
        setIsSubmittingFeedback(true)
        try {
            await submitFeedbackApi({
                type: "general",
                rating: feedbackRating,
                message: feedbackText,
                email: feedbackEmail,
                context: "create-free-after-download",
            })
            toast.success("Thanks. Feedback received.")
            setShowSuccessModal(false)
            setFeedbackRating("")
            setFeedbackText("")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send feedback")
        } finally {
            setIsSubmittingFeedback(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">

            {/* ─────────────── TOP BAR ─────────────── */}
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center font-bold">
                            M
                        </div>
                        <span className="font-semibold text-lg">
                            Micro Invoice
                        </span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">
                            Free Invoice Creator
                        </span>
                    </div>

                    {/* Right */}
                    <Button
                        variant="outline"
                        className="font-semibold"
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                    >
                        Get Unlimited for $5 →
                    </Button>
                </div>
            </header>

            {/* ─────────────── MAIN GRID ─────────────── */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6 rounded-lg border bg-white p-4 text-sm">
                    <div className="font-semibold">You're creating a FREE invoice</div>
                    <div className="text-slate-600">No signup. No credit card. Try it first, then upgrade only if it helps.</div>
                    <div className="mt-3 text-xs text-slate-600">
                        Step 1: Business {progress.hasBusiness ? "✓" : "•"} | Step 2: Client {progress.hasClient ? "✓" : "•"} | Step 3: Line items {progress.hasLineItem ? "✓" : "•"}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-8rem)]">

                    {/* ─────────────── FORM (2 cols) ─────────────── */}
                    <div className="lg:col-span-2">
                        <InvoiceForm
                            canExportInvoice={canExportInvoice}
                            onInvoiceExported={onInvoiceExported}
                        />
                    </div>

                    {/* ─────────────── PREVIEW (3 cols – dominant) ─────────────── */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Invoice Preview</h2>
                            <span className="text-xs text-slate-500">Live preview</span>
                        </div>
                        <div className="w-full overflow-hidden">
                            <InvoicePreview />
                        </div>
                    </div>

                </div>

                <div className="mt-10 border-t pt-6 text-sm text-slate-600 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {isAnonymous ? (
                        <div>Free invoices used: {Math.min(freeUsed, FREE_LIMIT)}/{FREE_LIMIT} ({remainingFree} left)</div>
                    ) : (
                        <div>
                            {isFreeUser ? "You are on Free plan." : "Unlimited plan active."}
                        </div>
                    )}
                    {isFreeUser ? (
                        <Button
                            variant="outline"
                            className="font-semibold w-full sm:w-auto"
                            onClick={handleUpgrade}
                            disabled={isUpgrading}
                        >
                            Remove Limits - $5 →
                        </Button>
                    ) : null}
                </div>
            </main>
            {showSuccessModal ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-semibold">Your invoice is ready</h3>
                        <p className="text-sm text-slate-600">
                            Invoice {invoiceNumber || "INV-001"} exported successfully. Upgrade for unlimited save + edit.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["😍", "😊", "😐", "😞"].map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    className={`h-10 w-10 rounded-md border ${feedbackRating === emoji ? "border-primary" : "border-slate-200"}`}
                                    onClick={() => setFeedbackRating(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="min-h-[88px] w-full rounded-md border border-input p-2 text-sm"
                            placeholder="What did you like / what should improve?"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                        />
                        <input
                            className="h-9 w-full rounded-md border border-input px-3 text-sm"
                            placeholder="Your email (optional)"
                            value={feedbackEmail}
                            onChange={(e) => setFeedbackEmail(e.target.value)}
                        />
                        <div className="flex flex-wrap justify-between gap-2">
                            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>Maybe Later</Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={submitFeedback} disabled={isSubmittingFeedback}>
                                    {isSubmittingFeedback ? "Sending..." : "Send Feedback"}
                                </Button>
                                <Button onClick={handleUpgrade} disabled={isUpgrading}>Get Unlimited - $5</Button>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">
                            You have {remainingFree} free invoices left.
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
