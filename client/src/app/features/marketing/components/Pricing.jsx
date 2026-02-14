import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

const plans = [
    {
        name: "FREE",
        price: "$0",
        badge: "Try It Now",
        features: [
            "3 invoices",
            "All templates",
            "PDF download",
            "No signup needed",
            "No cloud save",
            "No editing later",
        ],
        buttonText: "Try Free Now",
        highlighted: false,
    },
    {
        name: "UNLIMITED",
        price: "$5 one-time",
        badge: "Most Popular",
        features: [
            "Everything in Free",
            "Unlimited invoices",
            "Cloud save",
            "Edit anytime",
            "Client database",
            "Payment tracking",
            "Lifetime updates",
        ],
        buttonText: "Get Unlimited - $5",
        highlighted: true,
    },
]

export default function Pricing() {
    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-6">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        No Monthly Fees. Ever.
                    </h2>
                    <p className="mt-3 text-muted-foreground">Pay $5 once. Keep it forever.</p>
                </div>

                {/* Pricing Cards */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`shadow-lg ${plan.highlighted ? "border-2 border-primary" : ""
                                }`}
                        >
                            <CardContent className="p-8 text-center">
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <p className="mt-2 text-3xl font-bold">{plan.price}</p>
                                <div className="mt-2 text-xs font-medium text-primary">{plan.badge}</div>

                                <ul className="mt-6 space-y-3 text-sm text-muted-foreground text-left">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>• {feature}</li>
                                    ))}
                                </ul>

                                <Button
                                    size="lg"
                                    className={`mt-8 w-full ${plan.highlighted ? "bg-primary text-white" : ""
                                        }`}
                                    asChild
                                >
                                    <Link to={plan.highlighted ? "/signup" : "/create-free"}>
                                        {plan.buttonText}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-12 text-center text-sm text-muted-foreground">
                    💳 Secure payment via Stripe
                    <br />
                    ✓ No subscription. Pay once, keep forever.
                    <br />
                    ✓ 30-day money-back guarantee
                </div>

            </div>
        </section>
    )
}
