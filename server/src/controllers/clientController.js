import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getClients = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page || 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
        const search = String(req.query.search || "").trim();

        const filter = { owner: req.user.id };
        if (search) {
            const regex = new RegExp(escapeRegex(search), "i");
            filter.$or = [{ name: regex }, { email: regex }];
        }

        const [items, totalCount] = await Promise.all([
            Client.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Client.countDocuments(filter),
        ]);

        const statsByEmail = new Map();
        const emails = items.map((c) => c.email).filter(Boolean);
        if (emails.length) {
            const invoiceStats = await Invoice.aggregate([
                { $match: { owner: req.user.id, "client.email": { $in: emails } } },
                {
                    $group: {
                        _id: "$client.email",
                        invoices: { $sum: 1 },
                        totalOwed: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "paid"] }, 0, "$total"],
                            },
                        },
                    },
                },
            ]);
            for (const stat of invoiceStats) {
                statsByEmail.set(stat._id, {
                    invoices: stat.invoices,
                    totalOwed: stat.totalOwed,
                });
            }
        }

        return res.status(200).json({
            items: items.map((client) => ({
                ...client.toObject(),
                stats: statsByEmail.get(client.email) || { invoices: 0, totalOwed: 0 },
            })),
            page,
            limit,
            totalCount,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch clients" });
    }
};

export const createClient = async (req, res) => {
    try {
        const payload = req.body || {};
        if (!payload.name || !String(payload.name).trim()) {
            return res.status(400).json({ message: "Client name is required" });
        }

        const client = await Client.create({
            owner: req.user.id,
            name: String(payload.name).trim(),
            email: String(payload.email || "").trim(),
            phone: String(payload.phone || "").trim(),
            addressLine1: String(payload.addressLine1 || "").trim(),
            addressLine2: String(payload.addressLine2 || "").trim(),
            cityStateZip: String(payload.cityStateZip || "").trim(),
        });

        return res.status(201).json(client);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create client" });
    }
};

export const updateClient = async (req, res) => {
    try {
        const payload = req.body || {};
        if (!payload.name || !String(payload.name).trim()) {
            return res.status(400).json({ message: "Client name is required" });
        }

        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            {
                name: String(payload.name).trim(),
                email: String(payload.email || "").trim(),
                phone: String(payload.phone || "").trim(),
                addressLine1: String(payload.addressLine1 || "").trim(),
                addressLine2: String(payload.addressLine2 || "").trim(),
                cityStateZip: String(payload.cityStateZip || "").trim(),
            },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        return res.status(200).json(client);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update client" });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete client" });
    }
};
