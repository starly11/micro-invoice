import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "Why so cheap? What's the catch?",
        answer:
            "I'm a solo developer. No VC pressure, no large team overhead. $5 covers costs and keeps the product simple.",
    },
    {
        question: "Can I really create an invoice in 30 seconds?",
        answer:
            "Yes. Fill details, choose template, export. The goal is speed first. You can still take your time if needed.",
    },
    {
        question: "How is this different from QuickBooks/FreshBooks?",
        answer:
            "Those are full accounting suites. Micro Invoice focuses on one thing only: fast invoicing.",
    },
    {
        question: "What if the site goes down?",
        answer: "Your invoices are stored in cloud DB, and you can always keep PDF backups.",
    },
    {
        question: "Will price increase later?",
        answer: "Early users keep their purchase. No retroactive charges.",
    },
]

export default function FAQ() {
    return (
        <section className="py-24 bg-muted/5">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Answers to the most common questions about Micro Invoice
                    </p>
                </div>

                {/* Accordion */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <Accordion type="single" collapsible>
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg font-semibold">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground mt-2 text-sm">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
