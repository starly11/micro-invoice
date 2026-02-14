import express from "express";
import {
    submitFeedback,
    subscribeNewsletter,
    trackPublicActivity,
    getPublicStats,
    getPublicActivity,
    getRecentFeedback,
} from "../controllers/publicController.js";

const PublicRouter = express.Router();

PublicRouter.post("/feedback", submitFeedback);
PublicRouter.post("/newsletter", subscribeNewsletter);
PublicRouter.post("/activity", trackPublicActivity);
PublicRouter.get("/stats", getPublicStats);
PublicRouter.get("/activity", getPublicActivity);
PublicRouter.get("/feedback/recent", getRecentFeedback);

export default PublicRouter;
