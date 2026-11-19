import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";

export function LoadingState({ label = "Loading data..." }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#0c1220] px-4 py-10 text-sm text-slate-400"
    >
      <LoaderCircle size={17} className="animate-spin text-emerald-400" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-10 text-center"
    >
      <AlertCircle size={22} className="text-rose-300" />
      <p className="max-w-md text-sm text-rose-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-300"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <p className="font-semibold text-slate-200">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
