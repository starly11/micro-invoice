import { Button } from "@/components/ui/button";

const FOUNDER_NAME = import.meta.env.VITE_FOUNDER_NAME || "Your Name";
const FOUNDER_PHOTO_URL = import.meta.env.VITE_FOUNDER_PHOTO_URL || "/founder-photo.svg";
const FOUNDER_EMAIL = import.meta.env.VITE_FOUNDER_EMAIL || "";
const FOUNDER_TWITTER = import.meta.env.VITE_FOUNDER_TWITTER || "";
const FOUNDER_LINKEDIN = import.meta.env.VITE_FOUNDER_LINKEDIN || "";
const getPhotoUrl = (rawUrl) => {
    const url = String(rawUrl || "");
    if (!url) return "";
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
        return url.replace("/upload/", "/upload/f_auto,q_100/");
    }
    return url;
};

export default function FounderStory() {
    const initials = String(FOUNDER_NAME)
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("");

    const photoUrl = getPhotoUrl(FOUNDER_PHOTO_URL);

    return (
        <section className="py-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                        <a
                            href={photoUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="h-60 w-40 shrink-0 overflow-hidden rounded-t-3xl  border bg-slate-100"
                            title="Open full image"
                        >
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={`${FOUNDER_NAME} profile`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
                                    {initials || "ME"}
                                </div>
                            )}
                        </a>

                        <div className="space-y-5 ml-5 mt-4">
                            <h3 className="text-xl font-semibold">Hi, I&apos;m {FOUNDER_NAME}</h3>
                            <p className="text-sm text-slate-700">
                                I built Micro Invoice because I was tired of paying $20/month for simple invoices.
                            </p>
                            <p className="text-sm text-slate-700">
                                This is my first SaaS. I&apos;m learning as I go. Your feedback helps me improve.
                            </p>
                            <p className="text-sm text-slate-700">Thanks for being here.</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {FOUNDER_EMAIL ? (
                                    <Button asChild variant="outline" size="sm">
                                        <a href={`mailto:${FOUNDER_EMAIL}`}>Email Me</a>
                                    </Button>
                                ) : null}
                                {FOUNDER_TWITTER ? (
                                    <Button asChild variant="outline" size="sm">
                                        <a href={FOUNDER_TWITTER} target="_blank" rel="noreferrer">Twitter</a>
                                    </Button>
                                ) : null}
                                {FOUNDER_LINKEDIN ? (
                                    <Button asChild variant="outline" size="sm">
                                        <a href={FOUNDER_LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
