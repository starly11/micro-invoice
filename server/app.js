import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { stripeWebhook } from './src/controllers/billingController.js';

import './src/configs/passport.js';
import AuthRouter from './src/routes/authRoutes.js';
import InvoiceRouter from './src/routes/invoiceRoutes.js';
import BillingRouter from './src/routes/billingRoutes.js';
import ClientRouter from './src/routes/clientRoutes.js';
import PublicRouter from './src/routes/publicRoutes.js';

const app = express();

// Trust proxy for rate limiter if behind proxy (e.g., Heroku, Nginx)
app.set('trust proxy', 1);

// ===== Middleware =====

// Stripe requires raw body for signature verification
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Body parsing
// Invoice payloads can include base64 logos, which are larger than raw files.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Cookie parsing
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// CORS setup - explicitly whitelist frontend origin
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===== Rate limiting =====

// Global rate limiter (e.g., general API protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: process.env.NODE_ENV === "production" ? 300 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req) => {
    if (req.method !== "GET") return false;
    const path = req.path || "";
    // Keep auth/public polling endpoints available so the app does not self-DOS.
    return (
      path === "/api/auth/me" ||
      path === "/api/public/stats" ||
      path === "/api/public/activity" ||
      path === "/api/public/feedback/recent"
    );
  },
});
app.use(globalLimiter);

// Stricter rate limiter for auth routes (login/register)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // Adjust as needed
  message: 'Too many login attempts, please try again later',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ===== Health check route =====
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// ===== Routes =====
app.use('/api/auth', AuthRouter);
app.use('/api/invoices', InvoiceRouter);
app.use('/api/billing', BillingRouter);
app.use('/api/clients', ClientRouter);
app.use('/api/public', PublicRouter);

// ===== Export app =====
export default app;
