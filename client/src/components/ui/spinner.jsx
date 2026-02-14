import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Loading..." }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-slate-600">{label}</span>
    </span>
  );
}

export function FullPageSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Spinner label={label} />
    </div>
  );
}
