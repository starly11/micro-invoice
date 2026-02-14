import Invoice from "../models/Invoice.js";
import User from "../models/User.js";
import {
    isDataUriImage,
} from "../utils/cloudinary.js";

const calculateTotals = (items = [], taxRate = 0) => {
    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
        0
    );
    const tax = subtotal * (Number(taxRate || 0) / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
};

export const getInvoices = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;

        const [items, totalCount] = await Promise.all([
            Invoice.find({ owner: req.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Invoice.countDocuments({ owner: req.user.id }),
        ]);

        return res.status(200).json({
            items,
            page,
            limit,
            totalCount,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch invoices" });
    }
};

export const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.status(200).json(invoice);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch invoice" });
    }
};

export const createInvoice = async (req, res) => {
    try {
        const payload = req.body || {};
        const user = await User.findById(req.user.id).select(
            "plan subscription freeTierLimit business.logoUrl"
        );
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const effectivePlan = user.plan || user.subscription?.tier || "free";
        if (effectivePlan !== "pro") {
            const count = await Invoice.countDocuments({ owner: req.user.id });
            const freeLimit = Number(user.freeTierLimit || 3);
            if (count >= freeLimit) {
                return res.status(403).json({
                    message: "Free plan limit reached. Upgrade to remove limits.",
                    code: "UPGRADE_REQUIRED",
                });
            }
            await User.findByIdAndUpdate(req.user.id, {
                "subscription.invoicesUsed": count + 1,
            });
        }

        const normalizedPayload = { ...payload };
        if (isDataUriImage(normalizedPayload?.business?.logoUrl)) {
            normalizedPayload.business = {
                ...(normalizedPayload.business || {}),
                // Keep invoice payload lean: logo uploads are handled in account/business settings.
                logoUrl: String(user?.business?.logoUrl || ""),
            };
        }

        const totals = calculateTotals(normalizedPayload.items, normalizedPayload.taxRate);

        const invoice = await Invoice.create({
            ...normalizedPayload,
            owner: req.user.id,
            subtotal: totals.subtotal,
            tax: totals.tax,
            total: totals.total,
        });

        return res.status(201).json(invoice);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create invoice" });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const payload = req.body || {};
        const existingInvoice = await Invoice.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!existingInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const normalizedPayload = { ...payload };
        const incomingLogo = normalizedPayload?.business?.logoUrl;

        if (isDataUriImage(incomingLogo)) {
            normalizedPayload.business = {
                ...(normalizedPayload.business || {}),
                // Ignore inline images on invoice updates to avoid repeated Cloudinary uploads.
                logoUrl: String(existingInvoice?.business?.logoUrl || ""),
            };
        }

        const totals = calculateTotals(normalizedPayload.items, normalizedPayload.taxRate);

        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            {
                ...normalizedPayload,
                subtotal: totals.subtotal,
                tax: totals.tax,
                total: totals.total,
            },
            { new: true }
        );

        return res.status(200).json(invoice);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update invoice" });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete invoice" });
    }
};
