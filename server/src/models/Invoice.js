import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
    {
        description: { type: String, trim: true, default: "" },
        quantity: { type: Number, default: 1 },
        rate: { type: Number, default: 0 },
    },
    { _id: false }
);

const partySchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, default: "" },
        email: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        addressLine1: { type: String, trim: true, default: "" },
        addressLine2: { type: String, trim: true, default: "" },
        cityStateZip: { type: String, trim: true, default: "" },
        logoUrl: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

const metaSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, trim: true, default: "INV-001" },
        issueDate: { type: String, default: "" },
        dueDate: { type: String, default: "" },
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        business: { type: partySchema, default: () => ({}) },
        client: { type: partySchema, default: () => ({}) },
        items: { type: [lineItemSchema], default: () => [] },
        meta: { type: metaSchema, default: () => ({}) },
        currency: { type: String, default: "USD" },
        taxRate: { type: Number, default: 0 },
        notes: { type: String, default: "" },
        status: { type: String, enum: ["draft", "unpaid", "paid", "overdue"], default: "unpaid" },
        subtotal: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
