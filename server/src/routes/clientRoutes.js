import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getClients,
    createClient,
    updateClient,
    deleteClient,
} from "../controllers/clientController.js";

const ClientRouter = express.Router();

ClientRouter.use(authMiddleware);

ClientRouter.get("/", getClients);
ClientRouter.post("/", createClient);
ClientRouter.put("/:id", updateClient);
ClientRouter.delete("/:id", deleteClient);

export default ClientRouter;
