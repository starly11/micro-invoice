import Stripe from "stripe";
import User from "../models/User.js";
import PublicActivity from "../models/PublicActivity.js";

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
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
        const stripe = getStripe();
        const clientUrl = String(
            process.env.CLIENT_URL || req.headers.origin || "http://localhost:5173"
        ).replace(/\/$/, "");
        const user = await User.findById(req.user.id).select("email plan stripeCustomerId");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.plan === "pro") {
            return res.status(400).json({ message: "User is already on pro plan" });
        }

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

        return res.status(200).json({ url: session.url });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to create checkout session",
        });
    }
};

export const stripeWebhook = async (req, res) => {
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
