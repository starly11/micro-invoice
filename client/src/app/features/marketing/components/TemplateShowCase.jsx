import { Card, CardContent } from "@/components/ui/card"

const templates = [
    {
        name: "Classic",
        description: "Clean, minimal, professional",
        image: "/templates/classic.svg",
    },
    {
        name: "Modern",
        description: "Bold headers, accent colors",
        image: "/templates/modern.svg",
    },
    {
        name: "Elegant",
        description: "Serif fonts, sophisticated",
        image: "/templates/elegant.svg",
    },
]

export default function TemplateShowcase() {
    return (
        <section className="py-24 bg-muted/5">
            <div className="mx-auto max-w-7xl px-6">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        From Messy Draft to <span className="text-primary">Professional PDF</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Your invoice should look like a business document, not a rushed Word file.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    <Card className="overflow-hidden border-dashed">
                        <CardContent className="p-6">
                            <div className="text-xs font-semibold text-slate-500">BEFORE</div>
                            <div className="mt-3 rounded-md border bg-slate-100 p-6 text-sm text-slate-500">
                                Unstructured text, inconsistent totals, hard-to-read layout.
                            </div>
                            <div className="mt-2 text-xs text-slate-500">Spent 30 minutes</div>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-primary/30">
                        <CardContent className="p-6">
                            <div className="text-xs font-semibold text-primary">AFTER</div>
                            <div className="mt-3 rounded-md border bg-white p-6 text-sm text-slate-700">
                                Clean structure, professional template, instant PDF output.
                            </div>
                            <div className="mt-2 text-xs text-slate-500">Took under 30 seconds</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Template Cards */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card key={template.name} className="overflow-hidden shadow-lg">
                            <CardContent className="p-0">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="h-56 w-full object-cover"
                                />
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-semibold">{template.name}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {template.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}
