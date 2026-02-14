import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        ticketId: { type: String, required: true, unique: true, index: true },
        type: {
            type: String,
            enum: ["bug", "feature", "general", "dashboard_widget"],
            default: "general",
            index: true,
        },
        context: { type: String, trim: true, default: "site" },
        message: { type: String, trim: true, default: "" },
        rating: { type: String, trim: true, default: "" },
        email: { type: String, trim: true, default: "" },
        location: { type: String, trim: true, default: "" },
        action: { type: String, trim: true, default: "" },
        urgency: { type: String, trim: true, default: "" },
        willingToPay: { type: String, trim: true, default: "" },
        useCase: { type: String, trim: true, default: "" },
        allowContact: { type: String, trim: true, default: "" },
        screenshotUrl: { type: String, trim: true, default: "" },
        status: {
            type: String,
            enum: ["under_review", "planned", "fixed", "closed"],
            default: "under_review",
            index: true,
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
