import passport from "passport";
import User from "../models/User.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from 'jsonwebtoken';
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import {
    uploadImageDataUri,
    isDataUriImage,
    isCloudinaryUrl,
    deleteCloudinaryImageByUrl,
} from "../utils/cloudinary.js";

const isSecureRequest = (req) => {
    if (req.secure) return true;
    const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
        .split(",")[0]
        .trim()
        .toLowerCase();
    const forwardedSsl = String(req.headers["x-forwarded-ssl"] || "")
        .trim()
        .toLowerCase();
    return forwardedProto === "https" || forwardedSsl === "on";
};

const getPrimaryClientUrl = () => {
    const configured = String(process.env.CLIENT_URL || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    return configured[0] || "http://localhost:5173";
};

const setAuthCookie = (req, res, token) => {
    const secure = process.env.NODE_ENV === "production" ? true : isSecureRequest(req);
    res.cookie("token", token, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const clearAuthCookie = (res) => {
    // Clear both variants so local/dev and production cookies are removed reliably.
    const base = { httpOnly: true, path: "/" };
    res.clearCookie("token", { ...base, secure: true, sameSite: "none" });
    res.clearCookie("token", { ...base, secure: false, sameSite: "lax" });
};

// ---------------------------------------- getMe -------------------------
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ---------------------------------------- register -------------------------
export const register = async (req, res) => {
    // 1. Always check if body exists first
    const { name, email, password } = req.body || {};

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, email, password) are required"
            });
        }
        const isValidPassword = (password) => password.length >= 6;
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter valid email" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            provider: 'local'
        });

        // Generate token for new user
        const token = newUser.generateJWT();

        // Set auth cookie so user is logged in immediately after signup
        setAuthCookie(req, res, token);

        return res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                provider: newUser.provider,
                plan: newUser.plan
            },
            token,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// -------------------------------------------- Login --------------------------------
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (user.provider !== "local") {
            return res.status(400).json({
                success: false,
                message: "This account uses Google login. Please sign in with Google."
            });
        }

        // Check if user has a password (for Google OAuth users)
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "This account uses Google login. Please sign in with Google."
            });
        }

        // AWAIT the compare password method!
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate Token
        const token = user.generateJWT();

        setAuthCookie(req, res, token);

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                plan: user.plan
            },
            token,
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ------------------------------------ googleAuthCallback --------------------
export const googleAuthCallback = async (req, res) => {
    try {
        const clientUrl = getPrimaryClientUrl();
        if (!req.user) {
            return res.redirect(`${clientUrl}/login`);
        }

        const token = req.user.generateJWT();

        // Pass token via URL param so the client (on a different domain)
        // can store it in localStorage — cross-domain cookies are unreliable.
        res.redirect(`${clientUrl}/auth/callback?token=${token}`);

    } catch (error) {
        console.error("Google Auth Error:", error);
        const clientUrl = getPrimaryClientUrl();
        res.redirect(`${clientUrl}/login`);
    }
};

// ================================ Logout ===================================
export const logout = async (req, res) => {
    try {
        clearAuthCookie(res);


        return res.status(200).json({
            success: true,
            message: 'Logout Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during logout"
        })
    }
}

// ================================ Update Profile ===================================
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body || {};
        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Name and email are required" });
        }

        const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existing) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name: String(name).trim(), email: String(email).trim().toLowerCase() },
            { new: true }
        ).select("-password");

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

// ================================ Change Password ===================================
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }
        if (String(newPassword).length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

        const user = await User.findById(req.user.id).select("+password");
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

        if (user.provider !== "local") {
            return res.status(400).json({
                success: false,
                message: "Google-auth accounts cannot change password here",
            });
        }

        const valid = await user.comparePassword(currentPassword);
        if (!valid) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update password" });
    }
};

// ================================ Update Business ===================================
export const updateBusiness = async (req, res) => {
    try {
        const business = req.body || {};
        const existingUser = await User.findById(req.user.id).select("business");
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const currentBusiness = existingUser.business || {};
        let nextLogoUrl = String(business.logoUrl ?? currentBusiness.logoUrl ?? "").trim();

        if (isDataUriImage(nextLogoUrl)) {
            nextLogoUrl = await uploadImageDataUri(nextLogoUrl);
            if (isCloudinaryUrl(currentBusiness.logoUrl) && currentBusiness.logoUrl !== nextLogoUrl) {
                await deleteCloudinaryImageByUrl(currentBusiness.logoUrl);
            }
        } else if (!nextLogoUrl && isCloudinaryUrl(currentBusiness.logoUrl)) {
            await deleteCloudinaryImageByUrl(currentBusiness.logoUrl);
        }

        const mergedBusiness = {
            name: String(business.name ?? currentBusiness.name ?? "").trim(),
            email: String(business.email ?? currentBusiness.email ?? "").trim(),
            phone: String(business.phone ?? currentBusiness.phone ?? "").trim(),
            addressLine1: String(business.addressLine1 ?? currentBusiness.addressLine1 ?? "").trim(),
            addressLine2: String(business.addressLine2 ?? currentBusiness.addressLine2 ?? "").trim(),
            cityStateZip: String(business.cityStateZip ?? currentBusiness.cityStateZip ?? "").trim(),
            country: String(business.country ?? currentBusiness.country ?? "USA").trim(),
            logoUrl: nextLogoUrl,
            defaultCurrency: String(business.defaultCurrency ?? currentBusiness.defaultCurrency ?? "USD").trim(),
            defaultTaxRate: Number(
                business.defaultTaxRate ?? currentBusiness.defaultTaxRate ?? 0
            ),
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { business: mergedBusiness },
            { new: true }
        ).select("-password");

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update business details" });
    }
};

// ================================ Delete Account ===================================
export const deleteAccount = async (req, res) => {
    try {
        await Promise.all([
            Invoice.deleteMany({ owner: req.user.id }),
            Client.deleteMany({ owner: req.user.id }),
            User.findByIdAndDelete(req.user.id),
        ]);

        clearAuthCookie(res);

        return res.status(200).json({ success: true, message: "Account deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete account" });
    }
};
