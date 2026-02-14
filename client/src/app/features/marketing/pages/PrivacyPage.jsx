import MarketingNav from "../components/MarketingNav";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <MarketingNav />
            <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold">Privacy Policy</h1>
                    <p className="text-sm text-slate-600">Last updated: February 14, 2026</p>
                </header>

                <section className="space-y-3 text-sm text-slate-700">
                    <p>
                        This Privacy Policy explains how Micro Invoice ("Micro Invoice", "we", "us", "our") collects,
                        uses, and shares information when you use our website and services.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Information We Collect</h2>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                        <li>Account information like your name, email, and password.</li>
                        <li>Invoice data you create, such as client details, items, and totals.</li>
                        <li>Usage data such as pages viewed, device/browser type, and features used.</li>
                        <li>Payment details handled by our payment processor (we do not store full card details).</li>
                        <li>Support messages you send to us.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">How We Use Information</h2>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                        <li>Provide, maintain, and improve the service.</li>
                        <li>Process transactions and deliver receipts.</li>
                        <li>Communicate with you about your account and product updates.</li>
                        <li>Protect the security and integrity of the service.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Sharing of Information</h2>
                    <p className="text-sm text-slate-700">
                        We share information with service providers who help us operate the service (for example, hosting,
                        analytics, and payment processing like Paddle). We do not sell your personal information.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Data Retention</h2>
                    <p className="text-sm text-slate-700">
                        We retain your information for as long as your account is active or as needed to provide the service.
                        You can request deletion by contacting us.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Your Choices</h2>
                    <p className="text-sm text-slate-700">
                        You can update your account information in the app. You can opt out of marketing emails using the
                        unsubscribe link or by contacting us. You can also request access to or deletion of your data.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Security</h2>
                    <p className="text-sm text-slate-700">
                        We use reasonable safeguards to protect your information, but no method of transmission or storage
                        is completely secure.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">International Transfers</h2>
                    <p className="text-sm text-slate-700">
                        Your information may be processed in countries other than your own. We take steps to protect data
                        in accordance with applicable laws.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Children’s Privacy</h2>
                    <p className="text-sm text-slate-700">
                        The service is not intended for children under 13, and we do not knowingly collect their information.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Changes</h2>
                    <p className="text-sm text-slate-700">
                        We may update this policy from time to time. The updated date will be shown at the top of this page.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Contact</h2>
                    <p className="text-sm text-slate-700">
                        If you have questions about privacy, contact us at{" "}
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
