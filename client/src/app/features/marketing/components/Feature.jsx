import { Card, CardContent } from "@/components/ui/card"

export default function Features() {
    return (
        <section className="bg-muted/40 py-24">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything You Need.{" "}
                        <span className="text-primary">Nothing You Don't.</span>
                    </h2>
                </div>

                {/* Feature Cards */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Card 1 */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-4 text-3xl">⚡</div>
                            <h3 className="text-lg font-semibold">
                                Lightning Fast
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Create an invoice in under 30 seconds. No complicated forms
                                or setup.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 2 */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-4 text-3xl">💰</div>
                            <h3 className="text-lg font-semibold">
                                Pay Once, Own Forever
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                $5 one-time payment. No monthly fees. No hidden charges.
                                Yours forever.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Card 3 */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-4 text-3xl">☁️</div>
                            <h3 className="text-lg font-semibold">
                                Saved in Cloud
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Access your invoices anywhere. Never lose track of what
                                you're owed.
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    )
}
