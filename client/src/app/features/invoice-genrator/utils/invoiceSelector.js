import { formatCurrency } from "./formatCurrency"

export const selectSubtotal = (items) =>
    items.reduce((sum, item) => sum + item.quantity * item.rate, 0)

export const selectTax = (subtotal, taxRate = 0) =>
    subtotal * (Number(taxRate) / 100)

export const selectTotal = (subtotal, tax) => subtotal + tax

export const selectPreviewItems = (items, currency) =>
    items.map((item) => ({
        ...item,
        rateFormatted: formatCurrency(item.rate, currency),
        amountFormatted: formatCurrency(item.quantity * item.rate, currency),
    }))
