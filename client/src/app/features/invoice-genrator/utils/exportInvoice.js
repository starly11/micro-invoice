import jsPDF from "jspdf"
import { toPng } from "html-to-image"
import { applyInvoicePrintStyles, removeInvoicePrintStyles } from "./printStyles"

const PRINT_ROOT_ID = "invoice-print-root"

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

export async function exportInvoiceAsImage(scale = 2) {
    const element =
        document.getElementById(PRINT_ROOT_ID) ||
        document.getElementById("invoice-preview")
    if (!element) return null

    const target =
        element.querySelector?.("#invoice-preview") ||
        element

    const printStyleEl = applyInvoicePrintStyles(target)

    const { width, height } = target.getBoundingClientRect()

    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready
    }

    const dataUrl = await toPng(target, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: scale,
        width: Math.ceil(width),
        height: Math.ceil(height),
        style: {
            transform: "scale(1)",
            transformOrigin: "top left",
        },
    })

    removeInvoicePrintStyles(printStyleEl)

    const img = await loadImage(dataUrl)
    return { dataUrl, width: img.width, height: img.height }
}

function formatInvoiceFileName(input) {
    if (!input) return "Invoice.pdf"
    const safe = String(input).trim().replace(/[^\w-]+/g, "-").replace(/-+/g, "-")
    return safe ? `${safe}.pdf` : "Invoice.pdf"
}

export async function downloadInvoicePDF({ fileName, scale = 2 } = {}) {
    const image = await exportInvoiceAsImage(scale)
    if (!image) return

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 24
    const contentWidth = Math.max(1, pageWidth - margin * 2)
    const contentHeight = Math.max(1, pageHeight - margin * 2)
    const scaleRatio = contentWidth / image.width
    const scaledHeight = image.height * scaleRatio

    if (scaledHeight <= contentHeight) {
        pdf.addImage(image.dataUrl, "PNG", margin, margin, contentWidth, scaledHeight)
        pdf.save(formatInvoiceFileName(fileName))
        return
    }

    const pageCanvas = document.createElement("canvas")
    const pageContext = pageCanvas.getContext("2d")
    const pageCanvasHeight = Math.floor(contentHeight / scaleRatio)

    pageCanvas.width = image.width
    pageCanvas.height = pageCanvasHeight
    const sourceImage = await loadImage(image.dataUrl)

    let renderedHeight = 0
    let pageIndex = 0

    while (renderedHeight < image.height) {
        if (!pageContext) break

        pageContext.clearRect(0, 0, pageCanvas.width, pageCanvas.height)
        pageContext.drawImage(
            sourceImage,
            0,
            renderedHeight,
            pageCanvas.width,
            pageCanvas.height,
            0,
            0,
            pageCanvas.width,
            pageCanvas.height
        )

        const imgData = pageCanvas.toDataURL("image/png")

        if (pageIndex > 0) {
            pdf.addPage()
        }

        pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight)

        renderedHeight += pageCanvasHeight
        pageIndex += 1
    }

    pdf.save(formatInvoiceFileName(fileName))
}

export async function previewInvoiceImage({ scale = 2 } = {}) {
    const image = await exportInvoiceAsImage(scale)
    if (!image) return

    const win = window.open("", "_blank")
    if (!win) return

    win.document.write(
        `<title>Invoice Preview</title><img src="${image.dataUrl}" style="width:100%;height:auto;display:block;" />`
    )
    win.document.close()
}
