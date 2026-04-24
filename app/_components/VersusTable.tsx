import { CANDIDATE_STYLES } from "../_constants/candidates";
import type { GapLevel, VersusRow } from "../_types/dashboard";
import {
  formatDateLabel,
  formatNumber,
  formatPercent,
  formatSignedNumber,
} from "../_utils/format";
import { getGapClassStyles } from "../_utils/gap";

type VersusTableProps = {
  gapClass: GapLevel;
  gapPercent: number;
  gapVotes: number;
  rows: VersusRow[];
};

function getDeltaState(delta: number): { className: string; icon: string } {
  if (delta > 0) return { className: "text-emerald-600", icon: "▲" };
  if (delta < 0) return { className: "text-red-600", icon: "▼" };
  return { className: "text-slate-500", icon: "●" };
}

function getAdvantageState(value: number): { className: string; icon: string } {
  if (value > 0) return { className: "text-emerald-700", icon: "◀" };
  if (value < 0) return { className: "text-red-700", icon: "▶" };
  return { className: "text-slate-500", icon: "◆" };
}

export function VersusTable({
  gapClass,
  gapPercent,
  gapVotes,
  rows,
}: VersusTableProps) {
  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold text-zinc-900">
          Lopez Aliaga vs. Sanchez
        </h3>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getGapClassStyles(gapClass)}`}
        >
          {gapClass}
        </span>
        <p className="text-sm text-zinc-700 tabular-nums">
          Brecha actual: <strong>{formatPercent(gapPercent)}</strong> (
          {formatNumber(gapVotes)} votos)
        </p>
      </div>
      <p className="mt-1 text-sm text-zinc-600">
        Se muestran los ultimos 12 snapshots con votos acumulados, votos ganados
        frente al snapshot anterior y ventaja entre ambos.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur-sm">
        <table className="table-glass min-w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200 text-left text-zinc-700">
              <th className="px-3 py-2.5 font-semibold" scope="col">Snapshot</th>
              <th
                className="px-3 py-2.5 font-semibold text-center"
                style={{ color: CANDIDATE_STYLES[10].accent }}
                scope="col"
              >
                ● Votos
              </th>
              <th
                className="px-3 py-2.5 font-semibold text-center"
                style={{ color: CANDIDATE_STYLES[10].accent }}
                scope="col"
              >
                ↗ Delta
              </th>
              <th
                className="px-3 py-2.5 font-semibold text-center"
                style={{ color: CANDIDATE_STYLES[35].accent }}
                scope="col"
              >
                ● Votos
              </th>
              <th
                className="px-3 py-2.5 font-semibold text-center"
                style={{ color: CANDIDATE_STYLES[35].accent }}
                scope="col"
              >
                ↗ Delta
              </th>
              <th className="px-3 py-2.5 font-semibold text-center" scope="col">⚖ Ventaja</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
                const delta10State = getDeltaState(row.delta10);
                const delta35State = getDeltaState(row.delta35);
                const advantageState = getAdvantageState(row.ventaja);
                return (
              <tr
                key={row.timestamp}
                className="border-b border-slate-200/70 transition-colors hover:bg-slate-100/80"
              >
                <td className="px-3 py-2.5 tabular-nums text-zinc-800">{formatDateLabel(row.timestamp)}</td>
                <td className="px-3 py-2.5 font-medium text-zinc-800 tabular-nums text-center">
                  {formatNumber(row.votos10)}
                </td>
                <td className="px-3 py-2.5 text-center tabular-nums">
                  <span className={`inline-flex w-fit items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${delta10State.className} ${row.delta10 === 0 ? "border-slate-200 bg-slate-100/80" : row.delta10 > 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                    {delta10State.icon} {formatSignedNumber(row.delta10)}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-medium text-zinc-800 tabular-nums text-center">
                  {formatNumber(row.votos35)}
                </td>
                <td className="px-3 py-2.5 text-center tabular-nums">
                  <span className={`inline-flex w-fit items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${delta35State.className} ${row.delta35 === 0 ? "border-slate-200 bg-slate-100/80" : row.delta35 > 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                    {delta35State.icon} {formatSignedNumber(row.delta35)}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-medium tabular-nums text-center">
                  <span className={`inline-flex w-fit items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${advantageState.className} ${row.ventaja === 0 ? "border-slate-200 bg-slate-100/80" : row.ventaja > 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                    {advantageState.icon} {formatSignedNumber(row.ventaja)}
                  </span>
                </td>
              </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
