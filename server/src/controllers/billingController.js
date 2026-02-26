import Stripe from "stripe";
import User from "../models/User.js";
import PublicActivity from "../models/PublicActivity.js";

const getPaymentMode = () => {
    const rawMode = String(process.env.PAYMENT_MODE || "mock")
        .trim()
        .toLowerCase();
    return rawMode === "stripe" ? "stripe" : "mock";
};

const isStripeEnabled = () => getPaymentMode() === "stripe" && Boolean(process.env.STRIPE_SECRET_KEY);

const getStripe = () => {
    if (!isStripeEnabled()) {
        throw new Error("Stripe is not enabled. Set PAYMENT_MODE=stripe and STRIPE_SECRET_KEY.");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getClientUrl = (req) => {
    return String(process.env.CLIENT_URL || req.headers.origin || "http://localhost:5173").replace(/\/$/, "");
};

const getCheckoutLineItem = () => {
    const priceId = String(process.env.STRIPE_PRICE_ID || "").trim();
    if (priceId) {
        return {
            price: priceId,
            quantity: 1,
        };
    }

    // Fallback for local/dev when STRIPE_PRICE_ID is not configured.
    return {
        price_data: {
            currency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
            unit_amount: Number(process.env.STRIPE_AMOUNT_CENTS || 500),
            product_data: {
                name: "Micro Invoice Unlimited",
                description: "One-time payment to remove invoice limits",
            },
        },
        quantity: 1,
    };
};

export const createCheckoutSession = async (req, res) => {
    try {
        const clientUrl = getClientUrl(req);
        const user = await User.findById(req.user.id).select(
            "email plan stripeCustomerId subscription paidAt stripePaymentId"
        );
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.plan === "pro") {
            return res.status(400).json({ message: "User is already on pro plan" });
        }

        if (!isStripeEnabled()) {
            const mockPaymentId = `mock_${Date.now()}`;
            user.plan = "pro";
            user.paidAt = new Date();
            user.stripePaymentId = mockPaymentId;
            user.subscription = {
                ...(user.subscription || {}),
                tier: "pro",
            };
            await user.save();

            await PublicActivity.create({
                action: "user_upgraded",
                location: "Mock Checkout",
                meta: { userId: String(user._id), paymentMode: "mock" },
            });

            return res.status(200).json({
                mode: "mock",
                url: `${clientUrl}/dashboard?billing=success&payment_mode=mock`,
                message: "Demo payment mode enabled. User upgraded without Stripe.",
            });
        }

        const stripe = getStripe();
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: String(user._id) },
            });
            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer: customerId,
            line_items: [getCheckoutLineItem()],
            success_url: `${clientUrl}/dashboard?billing=success`,
            cancel_url: `${clientUrl}/dashboard?billing=cancel`,
            metadata: {
                userId: String(user._id),
                plan: "pro",
            },
        });

        return res.status(200).json({ mode: "stripe", url: session.url });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to create checkout session",
        });
    }
};

export const stripeWebhook = async (req, res) => {
    if (!isStripeEnabled()) {
        return res.status(200).json({ received: true, skipped: true, mode: "mock" });
    }

    const sig = req.headers["stripe-signature"];

    try {
        const stripe = getStripe();
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            return res.status(500).json({ message: "STRIPE_WEBHOOK_SECRET is not configured" });
        }

        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session?.metadata?.userId;
            if (userId) {
                await User.findByIdAndUpdate(userId, {
                    plan: "pro",
                    "subscription.tier": "pro",
                    paidAt: new Date(),
                    stripePaymentId: String(session?.payment_intent || ""),
                });
                await PublicActivity.create({
                    action: "user_upgraded",
                    location: "Checkout",
                    meta: { userId: String(userId) },
                });
            }
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
