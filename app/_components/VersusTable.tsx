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
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/40 bg-white/25 p-2 backdrop-blur-md">
        <table className="table-glass min-w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-zinc-200/70 text-left text-zinc-700">
              <th className="px-3 py-2" scope="col">Snapshot</th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[10].accent }}
                scope="col"
              >
                ● Votos
              </th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[10].accent }}
                scope="col"
              >
                ↗ Delta
              </th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[35].accent }}
                scope="col"
              >
                ● Votos
              </th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[35].accent }}
                scope="col"
              >
                ↗ Delta
              </th>
              <th className="px-3 py-2" scope="col">⚖ Ventaja</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.timestamp}
                className="border-b border-slate-200/70 transition-colors hover:bg-slate-100/70"
              >
                <td className="px-3 py-2 tabular-nums text-zinc-800">{formatDateLabel(row.timestamp)}</td>
                <td className="px-3 py-2 font-medium text-zinc-800 tabular-nums">
                  {formatNumber(row.votos10)}
                </td>
                <td
                  className={`px-3 py-2 tabular-nums ${row.delta10 >= 0 ? "text-emerald-600" : "text-red-300"}`}
                >
                  {row.delta10 >= 0 ? "▲" : "▼"}{" "}
                  {formatSignedNumber(row.delta10)}
                </td>
                <td className="px-3 py-2 font-medium text-zinc-800 tabular-nums">
                  {formatNumber(row.votos35)}
                </td>
                <td
                  className={`px-3 py-2 tabular-nums ${row.delta35 >= 0 ? "text-emerald-600" : "text-red-300"}`}
                >
                  {row.delta35 >= 0 ? "▲" : "▼"}{" "}
                  {formatSignedNumber(row.delta35)}
                </td>
                <td
                  className={`px-3 py-2 font-medium tabular-nums ${row.ventaja >= 0 ? "text-emerald-600" : "text-red-300"}`}
                >
                  {row.ventaja >= 0 ? "◀" : "▶"}{" "}
                  {formatSignedNumber(row.ventaja)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
