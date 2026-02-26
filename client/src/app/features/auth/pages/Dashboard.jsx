import { useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useInvoices } from "../../invoice/hooks/useInvoices"
import { getInvoiceStats } from "../../invoice/utils/invoiceStats"
import { useAuthStore } from "../store/authStore"
import { useCreateCheckoutSession } from "../../billing/hooks/useCreateCheckoutSession"
import { trackPublicActivityApi } from "../../marketing/api/public"
import { toast } from "sonner"
import { InvoicesTableSection } from "../../invoice/components/InvoicesTableSection"
import { useQueryClient } from "@tanstack/react-query"
import { FullPageSpinner } from "@/components/ui/spinner"

export const Dashboard = () => {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = 1
  const limit = 20

  const { data, isLoading, isError, refetch } = useInvoices({ page, limit })
  const { mutateAsync: createCheckout, isPending: isUpgrading } = useCreateCheckoutSession()

  const invoices = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []
  const stats = getInvoiceStats(invoices)
  const isPro = user?.plan === "pro"
  const configuredPaymentMode = String(import.meta.env.VITE_PAYMENT_MODE || "mock").toLowerCase()
  const showDemoPaymentBadge = configuredPaymentMode !== "stripe"

  useEffect(() => {
    const billing = searchParams.get("billing")
    if (!billing) return

    if (billing === "success") {
      const paymentMode = searchParams.get("payment_mode") || "stripe"
      if (paymentMode === "mock") {
        toast.success("Demo payment completed. Unlimited plan activated for showcase mode.")
      } else {
        toast.success("Payment successful. Unlimited plan is now active.")
      }
      queryClient.invalidateQueries({ queryKey: ["me"] })
      trackPublicActivityApi({ action: "user_upgraded", location: "Dashboard", source: "billing-success" }).catch(() => { })
    }
    if (billing === "cancel") {
      toast.message("Checkout canceled.")
    }
    navigate("/dashboard", { replace: true })
  }, [searchParams, queryClient, navigate])

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckout()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to start checkout")
    }
  }

  if (isLoading) {
    return <FullPageSpinner label="Loading dashboard..." />
  }

  if (isError) {
    return (
      <div className="p-6 space-y-3">
        <div className="text-sm text-red-600">Failed to load invoices.</div>
        <Button onClick={() => refetch()} variant="outline">Retry</Button>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="p-10">
        <div className="max-w-xl space-y-4">
          <h1 className="text-2xl font-semibold">Welcome — create your first invoice</h1>
          <p className="text-sm text-muted-foreground">
            Start billing in minutes. Your invoices will appear here once created.
          </p>
          <Button size="lg" asChild>
            <Link to="/invoice/new">Create First Invoice</Link>
          </Button>
          {!isPro && (
            <Button size="lg" variant="outline" onClick={handleUpgrade} disabled={isUpgrading}>
              Remove Limits - $5
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showDemoPaymentBadge && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Demo payment mode enabled. Checkout uses a mock success flow for portfolio demo.
        </div>
      )}

      {!isPro && (
        <div className="rounded-lg border p-4 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">Free plan:</span> 3 invoices max. Remove limits for one-time $5.
          </div>
          <Button onClick={handleUpgrade} disabled={isUpgrading}>
            Remove Limits - $5
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-xs text-muted-foreground">Total Invoices</div>
          <div className="text-2xl font-semibold">{stats.totalInvoices}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-muted-foreground">Unpaid</div>
          <div className="text-2xl font-semibold">{stats.unpaidCount}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-muted-foreground">Total Owed</div>
          <div className="text-2xl font-semibold">{stats.totalOwed}</div>
        </div>
      </div>

      <InvoicesTableSection />
    </div>
  )
}
