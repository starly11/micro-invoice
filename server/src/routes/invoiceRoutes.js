import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} from "../controllers/invoiceController.js";

const InvoiceRouter = express.Router();

InvoiceRouter.use(authMiddleware);

InvoiceRouter.get("/", getInvoices);
InvoiceRouter.get("/:id", getInvoice);
InvoiceRouter.post("/", createInvoice);
InvoiceRouter.put("/:id", updateInvoice);
InvoiceRouter.delete("/:id", deleteInvoice);

export default InvoiceRouter;
