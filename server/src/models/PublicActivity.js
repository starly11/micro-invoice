import mongoose from "mongoose";

const publicActivitySchema = new mongoose.Schema(
    {
        action: {
            type: String,
            enum: ["invoice_created", "pdf_download", "user_upgraded", "feedback_submitted"],
            required: true,
            index: true,
        },
        location: { type: String, trim: true, default: "Unknown" },
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

const PublicActivity = mongoose.model("PublicActivity", publicActivitySchema);
export default PublicActivity;

