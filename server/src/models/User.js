import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },

        password: {
            type: String,
            minlength: 6,
            select: false,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },
        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
            index: true,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        stripePaymentId: {
            type: String,
            trim: true,
            default: "",
        },
        avatar: {
            type: String,
            trim: true,
        },
        stripeCustomerId: {
            type: String,
            trim: true,
            index: true,
        },

        subscription: {
            tier: {
                type: String,
                enum: ["free", "pro"],
                default: "free",
            },
            invoicesUsed: { type: Number, default: 0 },
        },
        freeTierLimit: {
            type: Number,
            default: 3,
        },
        business: {
            name: { type: String, trim: true, default: "" },
            email: { type: String, trim: true, default: "" },
            phone: { type: String, trim: true, default: "" },
            addressLine1: { type: String, trim: true, default: "" },
            addressLine2: { type: String, trim: true, default: "" },
            cityStateZip: { type: String, trim: true, default: "" },
            country: { type: String, trim: true, default: "USA" },
            logoUrl: { type: String, trim: true, default: "" },
            defaultCurrency: { type: String, trim: true, default: "USD" },
            defaultTaxRate: { type: Number, default: 0 },
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { id: this.id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}


userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password || !enteredPassword) {
        return false;
    }
    return bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);
export default User;
