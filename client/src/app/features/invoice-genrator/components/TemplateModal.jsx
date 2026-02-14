import { templates } from "../utils/templates"
import { useInvoiceStore } from "../../auth/store/invoiceStore"

export function TemplateModal({ onClose }) {
    const activeTemplate = useInvoiceStore((s) => s.template)
    const setTemplate = useInvoiceStore((s) => s.setTemplate)

    return (
        <div className="p-6 bg-white border rounded-md space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Choose Your Template</h3>
                <button
                    type="button"
                    className="text-xs text-slate-500 hover:text-slate-800"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {Object.keys(templates).map((key) => (
                    <div key={key} className="border rounded-md p-3 space-y-3">
                        <div className="text-sm font-medium capitalize">{key}</div>
                        <div className="h-24 rounded bg-slate-100 text-xs text-slate-400 flex items-center justify-center">
                            Preview Image
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setTemplate(key)
                                onClose()
                            }}
                            className={
                                key === activeTemplate
                                    ? "w-full text-center px-3 py-2 border rounded text-xs font-semibold"
                                    : "w-full text-center px-3 py-2 border rounded text-xs text-slate-700"
                            }
                        >
                            {key === activeTemplate ? "Selected" : "Select"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
