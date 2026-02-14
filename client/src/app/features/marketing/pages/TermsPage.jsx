import MarketingNav from "../components/MarketingNav";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <MarketingNav />
            <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold">Terms of Service</h1>
                    <p className="text-sm text-slate-600">Last updated: February 14, 2026</p>
                </header>

                <section className="space-y-3 text-sm text-slate-700">
                    <p>
                        These Terms of Service ("Terms") govern your use of Micro Invoice ("Micro Invoice", "we", "us", "our").
                        By accessing or using the service, you agree to these Terms.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Accounts</h2>
                    <p className="text-sm text-slate-700">
                        You are responsible for your account credentials and for all activity that occurs under your account.
                        You agree to provide accurate information and keep it up to date. We may suspend accounts that appear
                        to be compromised or used in ways that violate these Terms.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Acceptable Use</h2>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                        <li>Use the service only for lawful purposes.</li>
                        <li>Do not attempt to access or disrupt the service, data, or accounts that you do not own.</li>
                        <li>Do not upload or share content that is illegal, harmful, or infringes on others’ rights.</li>
                        <li>Do not resell the service or offer it as part of another product without permission.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Invoices and Content</h2>
                    <p className="text-sm text-slate-700">
                        You retain ownership of the data and content you create. You grant us a limited license to host,
                        store, and process your content solely to provide the service.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Payments</h2>
                    <p className="text-sm text-slate-700">
                        If you purchase a paid plan, payments are processed by third‑party payment processors (for example, Paddle).
                        Pricing, billing cycles, and applicable taxes are displayed at checkout. By subscribing, you authorize
                        us and our payment processor to charge your chosen payment method.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Availability</h2>
                    <p className="text-sm text-slate-700">
                        We aim to keep the service available, but it may occasionally be unavailable for maintenance or due to
                        factors beyond our control.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Third‑Party Services</h2>
                    <p className="text-sm text-slate-700">
                        The service may integrate with third‑party services. Your use of those services is subject to their
                        own terms and policies.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Termination</h2>
                    <p className="text-sm text-slate-700">
                        You may stop using the service at any time. We may suspend or terminate access if you violate these
                        Terms or misuse the service.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Refunds</h2>
                    <p className="text-sm text-slate-700">
                        Refunds are handled on a case‑by‑case basis. If something goes wrong, contact us and we will try to
                        make it right. Where applicable, refund rules from our payment processor may also apply.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Disclaimers</h2>
                    <p className="text-sm text-slate-700">
                        The service is provided "as is" and "as available" without warranties of any kind, to the extent
                        permitted by law.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Limitation of Liability</h2>
                    <p className="text-sm text-slate-700">
                        To the extent permitted by law, Micro Invoice will not be liable for indirect, incidental, special,
                        consequential, or punitive damages, or for any loss of data, profits, or revenues.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Governing Law</h2>
                    <p className="text-sm text-slate-700">
                        These Terms are governed by the laws of Pakistan, without regard to conflict of law principles.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Contact</h2>
                    <p className="text-sm text-slate-700">
                        Questions about these Terms? Contact us at{" "}
                        <a className="text-slate-900 underline" href="mailto:support@microinvoice.app">
                            support@microinvoice.app
                        </a>{" "}
                        or via the{" "}
                        <Link className="text-slate-900 underline" to="/feedback">feedback page</Link>.
                    </p>
                </section>
            </div>
            <Footer />
        </main>
    );
}
