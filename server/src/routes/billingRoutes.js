import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createCheckoutSession } from "../controllers/billingController.js";

const BillingRouter = express.Router();

BillingRouter.post("/checkout-session", authMiddleware, createCheckoutSession);

export default BillingRouter;
