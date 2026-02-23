import jwt from 'jsonwebtoken'
export const authMiddleware = (req, res, next) => {

    const header = String(req.headers.authorization || '');
    const bearerToken = header.toLowerCase().startsWith('bearer ')
        ? header.slice(7).trim()
        : '';
    // Keep cookie fallback for backward compatibility.
    const token = bearerToken || req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};
