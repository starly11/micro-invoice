import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/features/auth/store/authStore";

export default function MarketingNav() {
    const user = useAuthStore((s) => s.user);

    return (
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
                <Link to="/" className="font-semibold">Micro Invoice</Link>
                <nav className="hidden items-center gap-4 text-sm md:flex">
                    <Link to="/create-free" className="text-slate-600 hover:text-slate-900">Create Free</Link>
                    <Link to="/feedback" className="text-slate-600 hover:text-slate-900">Feedback</Link>
                    {user ? (
                        <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
                            <Link to="/signup" className="text-slate-600 hover:text-slate-900">Signup</Link>
                        </>
                    )}
                </nav>
                <Button asChild size="sm">
                    <Link to="/create-free">Try Free</Link>
                </Button>
            </div>
        </header>
    );
}
