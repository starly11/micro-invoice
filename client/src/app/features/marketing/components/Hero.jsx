import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 py-24">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                    {/* LEFT SIDE – TEXT */}
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Create Professional Invoices in{" "}
                            <span className="text-primary">30 Seconds</span>
                        </h1>

                        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                            Stop wasting time on Word docs and clunky invoicing tools.
                            Generate professional invoices in seconds.
                            <br />
                            <span className="font-semibold text-foreground">
                                Just $5 one-time. No monthly fees. Ever.
                            </span>
                        </p>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                            Built by Starly, a freelance developer who was tired of paying $20/month for simple invoicing.
                            This is my first SaaS.
                        </p>
                        <div className="mt-4 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                            Early Access Pricing: $5 (normally $15) - first 100 users get lifetime pricing.
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/create-free">Try Free (No Signup)</Link>
                            </Button>

                            <Button size="lg" asChild>
                                <Link to="/signup">Get Started - $5</Link>
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT SIDE – DEMO / PREVIEW */}
                    <Card className="shadow-xl">
                        <CardContent className="p-6">
                            <div className="aspect-video rounded-lg bg-slate-50 border flex flex-col items-center justify-center text-slate-700">
                                <div className="text-sm font-semibold">No Monthly Fees. Ever.</div>
                                <div className="mt-2 text-xl font-bold">$5 Once. Keep It Forever.</div>
                                <div className="mt-3 text-xs text-slate-500">
                                    Try free first. Upgrade only if it helps your workflow.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    )
}
