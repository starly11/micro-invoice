export function applyInvoicePrintStyles(root) {
    if (!root) return null

    const style = document.createElement("style")
    style.setAttribute("data-invoice-print", "true")
    style.textContent = `
#${root.id} {
  background-color: #ffffff !important;
  margin: 0 auto !important;
  box-shadow: none !important;
  overflow: hidden !important;
}
#${root.id}, #${root.id} * {
  box-shadow: none !important;
  text-shadow: none !important;
  filter: none !important;
}
    `

    root.appendChild(style)
    return style
}

export function removeInvoicePrintStyles(styleEl) {
    if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl)
    }
}
