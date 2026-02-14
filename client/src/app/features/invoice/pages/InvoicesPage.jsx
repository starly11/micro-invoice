import { InvoicesTableSection } from "../components/InvoicesTableSection"

export function InvoicesPage() {
    return (
        <div className="space-y-5">
            <h1 className="text-xl font-semibold">Invoices</h1>
            <InvoicesTableSection />
        </div>
    )
}
