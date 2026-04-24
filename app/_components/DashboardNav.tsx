import { POLLING_MS } from "../_constants/candidates";
import type { CandidateResult } from "../_types/dashboard";
import { formatDateLabel } from "../_utils/format";

type DashboardNavProps = {
  candidate10: CandidateResult;
  candidate35: CandidateResult;
  currentSnapshotTimestamp: string;
};

export function DashboardNav({
  candidate10,
  candidate35,
  currentSnapshotTimestamp,
}: DashboardNavProps) {
  return (
    <nav className="glass-card sticky top-3 z-30 rounded-2xl px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            Perulytics | Presidenciales
          </p>
          <p className="text-xs text-zinc-600">
            Disputa central:{" "}
            {candidate35.nombreCandidato.split(" ").slice(0, 2).join(" ")} vs{" "}
            {candidate10.nombreCandidato.split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-700">
          <span className="glass-chip rounded-full px-3 py-1">
            Ultimo snapshot: {formatDateLabel(currentSnapshotTimestamp)}
          </span>
          <span className="glass-chip rounded-full px-3 py-1">
            Polling {POLLING_MS / 1000}s
          </span>
        </div>
      </div>
    </nav>
  );
}
