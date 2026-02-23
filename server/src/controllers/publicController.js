import { uploadImageDataUri, isDataUriImage } from "../utils/cloudinary.js";
import Feedback from "../models/Feedback.js";
import PublicActivity from "../models/PublicActivity.js";
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";

const SUPPORT_EMAIL = String(process.env.EMAIL_USER || "").trim();

let cachedTransporter = null;

const getTransporter = async () => {
    if (cachedTransporter) return cachedTransporter;

    const { default: nodemailer } = await import("nodemailer");

    cachedTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return cachedTransporter;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

const ensureMailConfig = () => {
    return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const toDayStart = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const anonymizeFeedback = (row) => {
    const timestamp = new Date(row.createdAt).toLocaleDateString();
    return {
        id: row.ticketId,
        type: row.type,
        rating: row.rating || "",
        message: row.message || "",
        status: row.status,
        createdAt: row.createdAt,
        dateLabel: timestamp,
        response:
            row.status === "fixed"
                ? "Fixed and shipped."
                : row.status === "planned"
                    ? "Planned for an upcoming release."
                    : "Under review.",
    };
};

export const submitFeedback = async (req, res) => {
    try {
        const payload = req.body || {};
        const typeRaw = String(payload.type || "general").trim().toLowerCase();
        const allowedTypes = new Set(["bug", "feature", "general", "dashboard_widget"]);
        const type = allowedTypes.has(typeRaw) ? typeRaw : "general";
        const rating = String(payload.rating || "").trim();
        const message = String(payload.message || "").trim();
        const email = String(payload.email || "").trim();
        const context = String(payload.context || "site").trim();
        const location = String(payload.location || "").trim();
        const action = String(payload.action || "").trim();
        const urgency = String(payload.urgency || "").trim();
        const willingToPay = String(payload.willingToPay || "").trim();
        const useCase = String(payload.useCase || "").trim();
        const allowContact = String(payload.allowContact || "").trim();
        const screenshotDataUri = String(payload.screenshotDataUri || "").trim();
        const ticketId = `FB-${Date.now().toString().slice(-6)}`;

        if (!message && !rating) {
            return res.status(400).json({ message: "Feedback message or rating is required" });
        }
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const feedback = await Feedback.create({
            ticketId,
            type,
            context,
            message,
            rating,
            email,
            location,
            action,
            urgency,
            willingToPay,
            useCase,
            allowContact,
            screenshotUrl: "",
        });

        await PublicActivity.create({
            action: "feedback_submitted",
            location: "Feedback Page",
            meta: { type },
        });

        // Respond fast; send emails in background so feedback submission doesn't fail on mail delays.
        res.status(200).json({ success: true, ticketId });

        if (!ensureMailConfig()) return;

        void (async () => {
            try {
                let screenshotUrl = "";
                if (isDataUriImage(screenshotDataUri)) {
                    try {
                        screenshotUrl = await uploadImageDataUri(
                            screenshotDataUri,
                            "micro-invoice/feedback"
                        );
                        await Feedback.findByIdAndUpdate(feedback._id, { screenshotUrl });
                    } catch {
                        screenshotUrl = "";
                    }
                }

                const transporter = await getTransporter();
                await transporter.sendMail({
                    from: SUPPORT_EMAIL,
                    to: SUPPORT_EMAIL,
                    replyTo: email || undefined,
                    subject: `[Micro Invoice] ${type.toUpperCase()} ${ticketId}`,
                    text: [
                        `Ticket: ${ticketId}`,
                        `Context: ${context}`,
                        `Type: ${type}`,
                        `Rating: ${rating || "N/A"}`,
                        `Email: ${email || "Anonymous"}`,
                        `Location: ${location || "N/A"}`,
                        `Action: ${action || "N/A"}`,
                        `Urgency: ${urgency || "N/A"}`,
                        `Willing To Pay: ${willingToPay || "N/A"}`,
                        `Use Case: ${useCase || "N/A"}`,
                        `Allow Contact: ${allowContact || "N/A"}`,
                        `Screenshot: ${screenshotUrl || "N/A"}`,
                        "",
                        "Message:",
                        message || "(No message provided)",
                    ].join("\n"),
                });

                if (email) {
                    await transporter.sendMail({
                        from: SUPPORT_EMAIL,
                        to: email,
                        subject: `Your feedback was received (${ticketId})`,
                        text: [
                            `Hey,`,
                            ``,
                            `Thanks for the feedback. I received your ${type} report and will review it.`,
                            `Ticket ID: ${ticketId}`,
                            `Status: Under Review`,
                            ``,
                            `Message preview: ${message.slice(0, 140) || "(No message provided)"}`,
                            ``,
                            `- Micro Invoice`,
                        ].join("\n"),
                    });
                }
            } catch {
                // Ignore mail delivery failures to keep feedback flow reliable.
            }
        })();
        return;
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to send feedback" });
    }
};

export const subscribeNewsletter = async (req, res) => {
    try {
        const payload = req.body || {};
        const email = String(payload.email || "").trim().toLowerCase();
        const source = String(payload.source || "landing").trim();

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }

        if (!ensureMailConfig()) {
            return res.status(200).json({
                success: true,
                message: "Subscribed. Email delivery is not configured yet.",
            });
        }

        const transporter = await getTransporter();
        await transporter.sendMail({
            from: SUPPORT_EMAIL,
            to: SUPPORT_EMAIL,
            replyTo: email,
            subject: "[Micro Invoice] Newsletter Signup",
            text: `Email: ${email}\nSource: ${source}\n`,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Failed to subscribe" });
    }
};

export const trackPublicActivity = async (req, res) => {
    try {
        const payload = req.body || {};
        const action = String(payload.action || "").trim();
        const location = String(payload.location || "Unknown").trim();
        const allowed = ["invoice_created", "pdf_download", "user_upgraded", "feedback_submitted"];

        if (!allowed.includes(action)) {
            return res.status(400).json({ message: "Invalid activity action" });
        }

        await PublicActivity.create({
            action,
            location: location || "Unknown",
            meta: {
                source: String(payload.source || "public").trim(),
            },
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: "Failed to track activity" });
    }
};

export const getPublicStats = async (_req, res) => {
    try {
        const dayStart = toDayStart();

        const [totalUsers, proUsers, totalInvoices, todayInvoices, todayUpgrades, todayPdfDownloads] =
            await Promise.all([
                User.countDocuments({}),
                User.countDocuments({ plan: "pro" }),
                Invoice.countDocuments({}),
                PublicActivity.countDocuments({ action: "invoice_created", createdAt: { $gte: dayStart } }),
                PublicActivity.countDocuments({ action: "user_upgraded", createdAt: { $gte: dayStart } }),
                PublicActivity.countDocuments({ action: "pdf_download", createdAt: { $gte: dayStart } }),
            ]);

        return res.status(200).json({
            totalUsers,
            proUsers,
            totalInvoices,
            todayInvoices,
            todayUpgrades,
            todayPdfDownloads,
            launchDays: 12,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load stats" });
    }
};

export const getPublicActivity = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit || 5), 20);
        const items = await PublicActivity.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            items: items.map((item) => ({
                id: String(item._id),
                action: item.action,
                location: item.location || "Unknown",
                createdAt: item.createdAt,
            })),
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load activity" });
    }
};

export const getRecentFeedback = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit || 5), 20);
        const items = await Feedback.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            items: items.map(anonymizeFeedback),
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load feedback" });
    }
};
