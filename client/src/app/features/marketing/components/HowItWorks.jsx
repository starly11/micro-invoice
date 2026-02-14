import { Card, CardContent } from "@/components/ui/card"

const steps = [
    {
        icon: "📝",
        title: "Fill",
        time: "10 seconds",
        text: "Business + client + line items",
    },
    {
        icon: "🎨",
        title: "Choose",
        time: "5 seconds",
        text: "Pick classic, modern, or elegant",
    },
    {
        icon: "📄",
        title: "Download",
        time: "1 second",
        text: "Export and send a clean PDF",
    },
]

export default function HowItWorks() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Stupid Simple{" "}
                        <span className="text-primary">Workflow</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Total time: about 16 seconds.
                    </p>
                </div>

                {/* Steps */}
                <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step) => (
                        <Card key={step.title} className="relative overflow-hidden">
                            <CardContent className="p-8">
                                <div className="mb-4 text-3xl">{step.icon}</div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold">
                                    {step.title}
                                </h3>
                                <p className="mt-1 text-xs font-medium text-primary">{step.time}</p>

                                {/* Description */}
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                    {step.text}
                                </p>

                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}
