const hasValue = (value) => Boolean(String(value || "").trim());

export function hasInvoiceContent(invoice) {
    if (!invoice) return false;

    const hasBusiness = hasValue(invoice?.business?.name);
    const hasClient = hasValue(invoice?.client?.name);
    const hasValidLineItem = Array.isArray(invoice?.items)
        ? invoice.items.some((item) => {
            const hasDescription = hasValue(item?.description);
            const quantity = Number(item?.quantity || 0);
            const rate = Number(item?.rate || 0);
            return hasDescription && quantity > 0 && rate > 0;
        })
        : false;

    return hasBusiness && hasClient && hasValidLineItem;
}
