import crypto from "crypto";

const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const CLOUDINARY_API_KEY = String(process.env.CLOUDINARY_API_KEY || "").trim();
const CLOUDINARY_API_SECRET = String(process.env.CLOUDINARY_API_SECRET || "").trim();

const hasCloudinaryConfig = () =>
    Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

export const isDataUriImage = (value) =>
    typeof value === "string" && /^data:image\/[a-zA-Z]+;base64,/.test(value);

export const isCloudinaryUrl = (value) =>
    typeof value === "string" && value.includes("res.cloudinary.com");

const buildSignature = (params) => {
    const query = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
    return crypto
        .createHash("sha1")
        .update(`${query}${CLOUDINARY_API_SECRET}`)
        .digest("hex");
};

export const uploadImageDataUri = async (dataUri, folder = "micro-invoice/logos") => {
    if (!isDataUriImage(dataUri)) return dataUri;
    if (!hasCloudinaryConfig()) {
        throw new Error("Cloudinary is not configured");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { folder, timestamp };
    const signature = buildSignature(paramsToSign);

    const form = new FormData();
    form.append("file", dataUri);
    form.append("folder", folder);
    form.append("timestamp", String(timestamp));
    form.append("api_key", CLOUDINARY_API_KEY);
    form.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: form,
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Cloudinary upload failed: ${message}`);
    }

    const payload = await response.json();
    return String(payload?.secure_url || "");
};

const extractPublicIdFromCloudinaryUrl = (url) => {
    if (!isCloudinaryUrl(url)) return "";

    const marker = "/upload/";
    const idx = url.indexOf(marker);
    if (idx < 0) return "";

    const path = url.slice(idx + marker.length);
    const cleaned = path.replace(/^v\d+\//, "");
    const lastDot = cleaned.lastIndexOf(".");
    return lastDot > 0 ? cleaned.slice(0, lastDot) : cleaned;
};

export const deleteCloudinaryImageByUrl = async (url) => {
    if (!isCloudinaryUrl(url) || !hasCloudinaryConfig()) return;
    const publicId = extractPublicIdFromCloudinaryUrl(url);
    if (!publicId) return;

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { public_id: publicId, timestamp };
    const signature = buildSignature(paramsToSign);

    const form = new FormData();
    form.append("public_id", publicId);
    form.append("timestamp", String(timestamp));
    form.append("api_key", CLOUDINARY_API_KEY);
    form.append("signature", signature);

    await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
        method: "POST",
        body: form,
    });
};

