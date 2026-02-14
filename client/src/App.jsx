import { lazy, Suspense } from "react";
import { useAuth } from "./app/features/auth/hooks/useAuth";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import { PublicRoute } from "./routes/PublicRoutes";
import { Toaster } from "sonner";
import { FullPageSpinner } from "./components/ui/spinner";
import { AppErrorBoundary } from "./components/app-error-boundary";

const LoginPage = lazy(() =>
  import("./app/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import("./app/features/auth/pages/SignupPage").then((m) => ({ default: m.SignupPage }))
);
const AuthCallback = lazy(() =>
  import("./app/features/auth/pages/AuthCallback").then((m) => ({ default: m.AuthCallback }))
);
const Landing = lazy(() =>
  import("./app/features/marketing/pages/Landing").then((m) => ({ default: m.Landing }))
);
const FeedbackPage = lazy(() =>
  import("./app/features/marketing/pages/FeedbackPage").then((m) => ({ default: m.FeedbackPage }))
);
const TermsPage = lazy(() =>
  import("./app/features/marketing/pages/TermsPage").then((m) => ({ default: m.TermsPage }))
);
const PrivacyPage = lazy(() =>
  import("./app/features/marketing/pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage }))
);
const Dashboard = lazy(() =>
  import("./app/features/auth/pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const CreateFreeInvoice = lazy(() =>
  import("./app/features/invoice-genrator/pages/CreateFreeInvoice")
);
const AppLayout = lazy(() =>
  import("./app/layouts/AppLayout").then((m) => ({ default: m.AppLayout }))
);
const InvoiceEditorPage = lazy(() =>
  import("./app/features/invoice/pages/InvoiceEditorPage").then((m) => ({ default: m.InvoiceEditorPage }))
);
const InvoiceViewPage = lazy(() =>
  import("./app/features/invoice/pages/InvoiceViewPage").then((m) => ({ default: m.InvoiceViewPage }))
);
const ClientsPage = lazy(() =>
  import("./app/features/invoice/pages/ClientsPage").then((m) => ({ default: m.ClientsPage }))
);
const AccountPage = lazy(() =>
  import("./app/features/account/pages/AccountPage").then((m) => ({ default: m.AccountPage }))
);
const InvoicesPage = lazy(() =>
  import("./app/features/invoice/pages/InvoicesPage").then((m) => ({ default: m.InvoicesPage }))
);

export const App = () => {
  const { isPending } = useAuth();

  if (isPending) {
    return <FullPageSpinner label="Loading app..." />;
  }
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <Suspense fallback={<FullPageSpinner label="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/create-free" element={<CreateFreeInvoice />} />
            {/* public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Route>
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoice/new" element={<InvoiceEditorPage />} />
                <Route path="/invoice/edit/:id" element={<InvoiceEditorPage />} />
                <Route path="/invoice/view/:id" element={<InvoiceViewPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
};
