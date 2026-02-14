import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        addressLine1: { type: String, trim: true, default: "" },
        addressLine2: { type: String, trim: true, default: "" },
        cityStateZip: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
);

clientSchema.index({ owner: 1, email: 1 });

const Client = mongoose.model("Client", clientSchema);
export default Client;
