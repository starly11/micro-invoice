import { create } from "zustand";

const today = new Date()
const todayISO = today.toISOString().slice(0, 10)
const dueISO = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10)
const buildDefaultInvoice = () => ({
    business: {
        name: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        cityStateZip: "",
        phone: "",
        logoUrl: "",
    },
    client: {
        name: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        cityStateZip: "",
    },
    items: [{ id: 1, description: "", quantity: 1, rate: 0 }],
    meta: {
        invoiceNumber: "INV-001",
        issueDate: todayISO,
        dueDate: dueISO,
    },
    currency: "USD",
    taxRate: 0,
    status: "unpaid",
    notes: "",
})

export const useInvoiceStore = create((set) => ({
    template: "classic",
    invoice: buildDefaultInvoice(),

    /* ───────── HEADER SETTERS ───────── */
    setBusinessName: (name) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, name },
            },
        })),

    setBusinessEmail: (email) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, email },
            },
        })),

    setBusinessPhone: (phone) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, phone },
            },
        })),

    setBusinessAddressLine1: (addressLine1) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, addressLine1 },
            },
        })),

    setBusinessAddressLine2: (addressLine2) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, addressLine2 },
            },
        })),

    setBusinessCityStateZip: (cityStateZip) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, cityStateZip },
            },
        })),

    setBusinessLogoUrl: (logoUrl) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                business: { ...state.invoice.business, logoUrl },
            },
        })),

    setClientName: (name) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                client: { ...state.invoice.client, name },
            },
        })),

    setClientEmail: (email) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                client: { ...state.invoice.client, email },
            },
        })),

    setClientAddressLine1: (addressLine1) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                client: { ...state.invoice.client, addressLine1 },
            },
        })),

    setClientAddressLine2: (addressLine2) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                client: { ...state.invoice.client, addressLine2 },
            },
        })),

    setClientCityStateZip: (cityStateZip) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                client: { ...state.invoice.client, cityStateZip },
            },
        })),

    setInvoiceNumber: (invoiceNumber) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                meta: { ...state.invoice.meta, invoiceNumber },
            },
        })),

    setIssueDate: (issueDate) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                meta: { ...state.invoice.meta, issueDate },
            },
        })),

    setDueDate: (dueDate) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                meta: { ...state.invoice.meta, dueDate },
            },
        })),

    setCurrency: (currency) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                currency,
            },
        })),

    /* ───────── LINE ITEM ACTIONS ───────── */
    addItem: () =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                items: [
                    ...state.invoice.items,
                    { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
                ],
            },
        })),

    updateItem: (id, patch) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                items: state.invoice.items.map((item) =>
                    item.id === id ? { ...item, ...patch } : item
                ),
            },
        })),

    removeItem: (id) =>
        set((state) => ({
            invoice: {
                ...state.invoice,
                items: state.invoice.items.filter((item) => item.id !== id),
            },
        })),

    setNotes: (notes) =>
        set((state) => ({
            invoice: { ...state.invoice, notes },
        })),

    setTaxRate: (taxRate) =>
        set((state) => ({
            invoice: { ...state.invoice, taxRate },
        })),

    setStatus: (status) =>
        set((state) => ({
            invoice: { ...state.invoice, status },
        })),

    replaceInvoice: (invoice) =>
        set(() => ({
            invoice: {
                ...buildDefaultInvoice(),
                ...invoice,
                business: { ...buildDefaultInvoice().business, ...(invoice?.business || {}) },
                client: { ...buildDefaultInvoice().client, ...(invoice?.client || {}) },
                meta: { ...buildDefaultInvoice().meta, ...(invoice?.meta || {}) },
                items: Array.isArray(invoice?.items)
                    ? invoice.items.map((item, idx) => ({
                        id: item?.id || crypto.randomUUID() || String(idx),
                        description: item?.description || "",
                        quantity: Number(item?.quantity || 0),
                        rate: Number(item?.rate || 0),
                    }))
                    : buildDefaultInvoice().items,
            },
        })),

    resetInvoice: () =>
        set(() => ({
            invoice: buildDefaultInvoice(),
        })),

    setTemplate: (template) =>
        set(() => ({
            template,
        })),
}));
