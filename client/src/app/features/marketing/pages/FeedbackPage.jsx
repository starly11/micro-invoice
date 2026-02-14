import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { submitFeedbackApi } from "../api/public";
import { toast } from "sonner";
import MarketingNav from "../components/MarketingNav";
import { useAuthStore } from "../../auth/store/authStore";
import { Loader2 } from "lucide-react";

const TABS = [
    { id: "bug", label: "Report Bug", icon: "🐛" },
    { id: "feature", label: "Request Feature", icon: "💡" },
    { id: "general", label: "General", icon: "💬" },
];

const toDataUri = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const MAX_SCREENSHOT_SIZE_BYTES = 4 * 1024 * 1024;

const loadImageFromDataUri = (dataUri) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUri;
    });

const compressImageDataUri = async (dataUri) => {
    const img = await loadImageFromDataUri(dataUri);
    const maxEdge = 1280;
    const ratio = Math.min(1, maxEdge / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * ratio));
    const height = Math.max(1, Math.round(img.height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUri;

    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.78);
};

export function FeedbackPage() {
    const user = useAuthStore((s) => s.user);
    const [tab, setTab] = useState("bug");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketId, setTicketId] = useState("");

    const [bug, setBug] = useState({
        message: "",
        location: "Dashboard",
        otherLocation: "",
        action: "",
        screenshotDataUri: "",
        email: user?.email || "",
    });
    const [feature, setFeature] = useState({
        message: "",
        why: "",
        urgency: "important",
        willingToPay: "not_sure",
        email: user?.email || "",
    });
    const [general, setGeneral] = useState({
        message: "",
        rating: "",
        useCase: "",
        otherUseCase: "",
        allowContact: "yes",
        email: user?.email || "",
    });

    const activeConfig = useMemo(() => TABS.find((x) => x.id === tab), [tab]);

    const submit = async () => {
        setIsSubmitting(true);
        try {
            let payload;
            if (tab === "bug") {
                if (!bug.message.trim()) {
                    toast.error("Please describe the bug.");
                    setIsSubmitting(false);
                    return;
                }
                payload = {
                    type: "bug",
                    context: "feedback-page",
                    message: bug.message,
                    location: bug.location === "Other" ? bug.otherLocation : bug.location,
                    action: bug.action,
                    screenshotDataUri: bug.screenshotDataUri,
                    email: bug.email,
                };
            } else if (tab === "feature") {
                if (!feature.message.trim()) {
                    toast.error("Please describe the feature.");
                    setIsSubmitting(false);
                    return;
                }
                payload = {
                    type: "feature",
                    context: "feedback-page",
                    message: feature.message,
                    action: feature.why,
                    urgency: feature.urgency,
                    willingToPay: feature.willingToPay,
                    email: feature.email,
                };
            } else {
                if (!general.message.trim()) {
                    toast.error("Please add your feedback message.");
                    setIsSubmitting(false);
                    return;
                }
                payload = {
                    type: "general",
                    context: "feedback-page",
                    message: general.message,
                    rating: general.rating,
                    useCase: general.useCase === "Other" ? general.otherUseCase : general.useCase,
                    allowContact: general.allowContact,
                    email: general.email,
                };
            }

            const result = await submitFeedbackApi(payload);
            setTicketId(result?.ticketId || "");
            toast.success("Feedback submitted");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <MarketingNav />
            <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
                <section className="rounded-xl border bg-cyan-50 p-6">
                    <h1 className="text-2xl font-semibold">Help Me Make This Better</h1>
                    <p className="mt-2 text-sm text-slate-700">
                        I built Micro Invoice as a solo developer. Found a bug, want a feature, or just want to share feedback?
                        I read every message and usually reply within 24 hours.
                    </p>
                </section>

                <div className="grid gap-6 lg:grid-cols-10">
                    <section className="space-y-4 lg:col-span-7">
                        <div className="flex flex-wrap gap-2 rounded-lg border bg-white p-3">
                            {TABS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`rounded-md px-3 py-2 text-sm ${tab === item.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
                                    onClick={() => {
                                        setTicketId("");
                                        setTab(item.id);
                                    }}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="rounded-lg border bg-white p-5 space-y-4">
                            <h2 className="text-lg font-semibold">{activeConfig?.icon} {activeConfig?.label}</h2>
                            {tab === "bug" ? (
                                <>
                                    <textarea
                                        className="min-h-[120px] w-full rounded-md border border-input p-2 text-sm"
                                        placeholder='What went wrong? Example: "Cannot delete invoice #5"'
                                        value={bug.message}
                                        onChange={(e) => setBug((p) => ({ ...p, message: e.target.value }))}
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                            value={bug.location}
                                            onChange={(e) => setBug((p) => ({ ...p, location: e.target.value }))}
                                        >
                                            {["Dashboard", "Creating new invoice", "Editing invoice", "Viewing invoice", "PDF download", "Settings/Account", "Other"].map((v) => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>
                                        {bug.location === "Other" ? (
                                            <input
                                                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                                placeholder="Where did it happen?"
                                                value={bug.otherLocation}
                                                onChange={(e) => setBug((p) => ({ ...p, otherLocation: e.target.value }))}
                                            />
                                        ) : null}
                                    </div>
                                    <input
                                        className="h-9 w-full rounded-md border border-input px-3 text-sm"
                                        placeholder="What were you trying to do?"
                                        value={bug.action}
                                        onChange={(e) => setBug((p) => ({ ...p, action: e.target.value }))}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (file.size > MAX_SCREENSHOT_SIZE_BYTES) {
                                                toast.error("Screenshot too large. Please use an image under 4MB.");
                                                return;
                                            }
                                            try {
                                                const dataUri = await toDataUri(file);
                                                const compressed = await compressImageDataUri(dataUri);
                                                setBug((p) => ({ ...p, screenshotDataUri: compressed }));
                                            } catch {
                                                toast.error("Failed to process screenshot");
                                            }
                                        }}
                                    />
                                    <input
                                        className="h-9 w-full rounded-md border border-input px-3 text-sm"
                                        placeholder="Your email (optional)"
                                        value={bug.email}
                                        onChange={(e) => setBug((p) => ({ ...p, email: e.target.value }))}
                                    />
                                </>
                            ) : null}

                            {tab === "feature" ? (
                                <>
                                    <textarea
                                        className="min-h-[120px] w-full rounded-md border border-input p-2 text-sm"
                                        placeholder='What feature do you want? Example: "Send invoice by email"'
                                        value={feature.message}
                                        onChange={(e) => setFeature((p) => ({ ...p, message: e.target.value }))}
                                    />
                                    <textarea
                                        className="min-h-[88px] w-full rounded-md border border-input p-2 text-sm"
                                        placeholder="Why do you need this?"
                                        value={feature.why}
                                        onChange={(e) => setFeature((p) => ({ ...p, why: e.target.value }))}
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                            value={feature.urgency}
                                            onChange={(e) => setFeature((p) => ({ ...p, urgency: e.target.value }))}
                                        >
                                            <option value="critical">Critical</option>
                                            <option value="important">Important</option>
                                            <option value="nice_to_have">Nice to have</option>
                                        </select>
                                        <select
                                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                            value={feature.willingToPay}
                                            onChange={(e) => setFeature((p) => ({ ...p, willingToPay: e.target.value }))}
                                        >
                                            <option value="yes">Yes, I'd pay extra</option>
                                            <option value="maybe">Maybe</option>
                                            <option value="no">No</option>
                                            <option value="not_sure">Not sure</option>
                                        </select>
                                    </div>
                                    <input
                                        className="h-9 w-full rounded-md border border-input px-3 text-sm"
                                        placeholder="Your email (optional)"
                                        value={feature.email}
                                        onChange={(e) => setFeature((p) => ({ ...p, email: e.target.value }))}
                                    />
                                </>
                            ) : null}

                            {tab === "general" ? (
                                <>
                                    <textarea
                                        className="min-h-[120px] w-full rounded-md border border-input p-2 text-sm"
                                        placeholder="What's on your mind?"
                                        value={general.message}
                                        onChange={(e) => setGeneral((p) => ({ ...p, message: e.target.value }))}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {["😍", "😊", "😐", "😞", "😡"].map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                className={`h-10 w-10 rounded-md border ${general.rating === emoji ? "border-primary" : "border-slate-200"}`}
                                                onClick={() => setGeneral((p) => ({ ...p, rating: emoji }))}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                            value={general.useCase}
                                            onChange={(e) => setGeneral((p) => ({ ...p, useCase: e.target.value }))}
                                        >
                                            {["Freelancing", "Consulting", "Small business", "Teaching/Tutoring", "Other"].map((v) => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>
                                        {general.useCase === "Other" ? (
                                            <input
                                                className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                                placeholder="Your use case"
                                                value={general.otherUseCase}
                                                onChange={(e) => setGeneral((p) => ({ ...p, otherUseCase: e.target.value }))}
                                            />
                                        ) : null}
                                    </div>
                                    <select
                                        className="h-9 rounded-md border border-input bg-white px-3 text-sm"
                                        value={general.allowContact}
                                        onChange={(e) => setGeneral((p) => ({ ...p, allowContact: e.target.value }))}
                                    >
                                        <option value="yes">Yes, you can contact me</option>
                                        <option value="maybe">Maybe later</option>
                                        <option value="no">No thanks</option>
                                    </select>
                                    <input
                                        className="h-9 w-full rounded-md border border-input px-3 text-sm"
                                        placeholder="Your email (optional)"
                                        value={general.email}
                                        onChange={(e) => setGeneral((p) => ({ ...p, email: e.target.value }))}
                                    />
                                </>
                            ) : null}

                            <div className="flex flex-wrap items-center justify-between gap-2">
                                {ticketId ? (
                                    <div className="text-xs text-slate-500">Submitted. Ticket ID: {ticketId}</div>
                                ) : <div />}
                                <Button onClick={submit} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : "Submit"}
                                </Button>
                            </div>
                        </div>

                        <section className="space-y-3 rounded-lg border bg-white p-5">
                            <h3 className="text-lg font-semibold">Current Roadmap</h3>
                            <div className="rounded-md border p-3">
                                <div className="font-medium">In Progress (This Week)</div>
                                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                                    <li>• Fix tax calculation rounding bug</li>
                                    <li>• Add invoice duplication feature</li>
                                </ul>
                            </div>
                            <div className="rounded-md border p-3">
                                <div className="font-medium">Planned (Next 2 Weeks)</div>
                                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                                    <li>• Email invoice directly to clients</li>
                                    <li>• Add more currency options</li>
                                    <li>• Recurring invoice templates</li>
                                </ul>
                            </div>
                            <div className="rounded-md border p-3">
                                <div className="font-medium">Considering</div>
                                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                                    <li>• Dark mode</li>
                                    <li>• Expense tracking</li>
                                    <li>• Multi-language support</li>
                                    <li>• API access</li>
                                </ul>
                            </div>
                        </section>
                    </section>

                    <aside className="space-y-4 lg:col-span-3">
                        <div className="rounded-lg border bg-white p-4 space-y-2 text-sm">
                            <h3 className="font-semibold">Quick Links</h3>
                            <Link className="block text-slate-600 hover:text-slate-900" to="/create-free">Create Free Invoice</Link>
                            <Link className="block text-slate-600 hover:text-slate-900" to="/dashboard">Dashboard</Link>
                            <a className="block text-slate-600 hover:text-slate-900" href={`mailto:${user?.email || ""}`}>Email Me</a>
                            <Link className="block text-slate-600 hover:text-slate-900" to="/feedback">Known Issues / Feedback</Link>
                        </div>
                        <div className="rounded-lg border bg-white p-4 space-y-2 text-sm">
                            <h3 className="font-semibold">Recent Updates</h3>
                            <p className="text-slate-600">Fixed invoice delete cache issue</p>
                            <p className="text-slate-600">Added Cloudinary logo uploads</p>
                            <p className="text-slate-600">Improved PDF export validation</p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 text-sm">
                            Need a direct route? <Link className="text-primary hover:underline" to={user ? "/dashboard" : "/signup"}>{user ? "Back to Dashboard" : "Create Account"}</Link>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
