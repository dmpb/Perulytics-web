import { useEffect, useMemo, useState } from "react";
import { POLLING_MS } from "../_constants/candidates";
import type { CandidateResult } from "../_types/dashboard";
import { formatDateLabel } from "../_utils/format";

type DashboardNavProps = {
  candidate10: CandidateResult;
  candidate35: CandidateResult;
  currentSnapshotTimestamp: string;
  lastRefresh: string | null;
  isRefreshing: boolean;
};

export function DashboardNav({
  candidate10,
  candidate35,
  currentSnapshotTimestamp,
  lastRefresh,
  isRefreshing,
}: DashboardNavProps) {
  const [remainingMs, setRemainingMs] = useState(POLLING_MS);

  useEffect(() => {
    const computeRemaining = () => {
      if (!lastRefresh) {
        setRemainingMs(POLLING_MS);
        return;
      }
      const elapsedMs = Date.now() - new Date(lastRefresh).getTime();
      const cycleMs = ((elapsedMs % POLLING_MS) + POLLING_MS) % POLLING_MS;
      setRemainingMs(POLLING_MS - cycleMs);
    };

    computeRemaining();
    const timer = setInterval(computeRemaining, 250);
    return () => {
      clearInterval(timer);
    };
  }, [lastRefresh]);

  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  const pollingState = useMemo(() => {
    if (isRefreshing) {
      return {
        label: "Actualizando",
        className: "bg-indigo-100 text-indigo-700 border-indigo-200",
        dotClass: "bg-indigo-500",
      };
    }
    if (remainingSeconds <= 6) {
      return {
        label: "Por actualizar",
        className:
          "bg-amber-100 text-amber-700 border-amber-200 animate-pulse",
        dotClass: "bg-amber-500",
      };
    }
    return {
      label: "Estable",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-500",
    };
  }, [isRefreshing, remainingSeconds]);

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 w-full border-b border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.12)] md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900">
            Perulytics | Presidenciales
          </p>
          <p className="text-xs text-zinc-600">
            Disputa central:{" "}
            {candidate35.nombreCandidato.split(" ").slice(0, 2).join(" ")} vs{" "}
            {candidate10.nombreCandidato.split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 text-xs font-semibold text-zinc-700 md:w-auto">
          <span className="glass-chip rounded-full px-3 py-1 text-zinc-700">
            Ultimo snapshot: {formatDateLabel(currentSnapshotTimestamp)}
          </span>
          <span
            className={`glass-chip inline-flex items-center gap-2 rounded-full border px-3 py-1 tabular-nums ${pollingState.className}`}
            role="status"
            aria-live="polite"
          >
            <span className={`h-2 w-2 rounded-full ${pollingState.dotClass}`} />
            Polling {remainingSeconds}s · {pollingState.label}
          </span>
        </div>
      </div>
    </nav>
  );
}
