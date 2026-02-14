import { useQuery } from "@tanstack/react-query";
import {
    getPublicActivityApi,
    getPublicStatsApi,
    getRecentFeedbackApi,
} from "../api/public";

const actionLabel = (action) => {
    switch (action) {
        case "invoice_created":
            return "created an invoice";
        case "pdf_download":
            return "downloaded a PDF";
        case "user_upgraded":
            return "upgraded to Pro";
        case "feedback_submitted":
            return "sent feedback";
        default:
            return action;
    }
};

export default function SocialProofSection() {
    const statsQuery = useQuery({
        queryKey: ["public-stats"],
        queryFn: getPublicStatsApi,
        refetchInterval: 120000,
        refetchIntervalInBackground: false,
    });
    const activityQuery = useQuery({
        queryKey: ["public-activity"],
        queryFn: () => getPublicActivityApi(5),
        refetchInterval: 120000,
        refetchIntervalInBackground: false,
    });
    const feedbackQuery = useQuery({
        queryKey: ["public-feedback"],
        queryFn: () => getRecentFeedbackApi(5),
        refetchInterval: 120000,
        refetchIntervalInBackground: false,
    });

    const stats = statsQuery.data || {};
    const activity = Array.isArray(activityQuery.data?.items) ? activityQuery.data.items : [];
    const feedback = Array.isArray(feedbackQuery.data?.items) ? feedbackQuery.data.items : [];
    const goal = 100;
    const progress = Math.min(goal, Number(stats.totalUsers || 0));
    const progressPercent = Math.round((progress / goal) * 100);

    return (
        <section className="bg-slate-50 py-14">
            <div className="mx-auto max-w-7xl space-y-6 px-6">
                <div className="rounded-xl border bg-white p-5">
                    <h3 className="text-lg font-semibold">You're Early</h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Micro Invoice is still early. Your feedback directly shapes what gets built next.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border p-3 text-sm">
                            <div className="text-slate-500">Users</div>
                            <div className="text-2xl font-semibold">{stats.totalUsers ?? 0}</div>
                        </div>
                        <div className="rounded-lg border p-3 text-sm">
                            <div className="text-slate-500">Pro Upgrades</div>
                            <div className="text-2xl font-semibold">{stats.proUsers ?? 0}</div>
                        </div>
                        <div className="rounded-lg border p-3 text-sm">
                            <div className="text-slate-500">Invoices Created</div>
                            <div className="text-2xl font-semibold">{stats.totalInvoices ?? 0}</div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5 lg:col-span-1">
                        <h4 className="font-semibold">Today's Activity</h4>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <div>Invoices created: <span className="font-medium text-slate-900">{stats.todayInvoices ?? 0}</span></div>
                            <div>Users upgraded: <span className="font-medium text-slate-900">{stats.todayUpgrades ?? 0}</span></div>
                            <div>PDFs downloaded: <span className="font-medium text-slate-900">{stats.todayPdfDownloads ?? 0}</span></div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5 lg:col-span-1">
                        <h4 className="font-semibold">Live Activity</h4>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                            {activity.length ? activity.map((item) => (
                                <div key={item.id}>
                                    Someone in {item.location || "Unknown"} just {actionLabel(item.action)}
                                </div>
                            )) : <div>No recent activity yet.</div>}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5 lg:col-span-1">
                        <h4 className="font-semibold">Goal Progress</h4>
                        <div className="mt-2 text-sm text-slate-600">Goal: 100 users</div>
                        <div className="mt-3 h-3 overflow-hidden rounded bg-slate-100">
                            <div className="h-full bg-slate-900" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className="mt-2 text-sm">{progress}/{goal}</div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <h4 className="font-semibold">Unfiltered Feedback</h4>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                        {feedback.length ? feedback.map((item) => (
                            <div key={item.id}>
                                <span className="mr-1">{item.rating || "💬"}</span>
                                {item.message || "(No message)"}{" "}
                                <span className="text-xs text-slate-400">- {item.dateLabel}</span>
                                <div className="text-xs text-slate-500">Status: {item.response}</div>
                            </div>
                        )) : <div>No feedback yet.</div>}
                    </div>
                </div>
            </div>
        </section>
    );
}
