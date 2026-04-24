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
        <h3 className="text-lg font-semibold text-zinc-900">
          Lopez Aliaga vs. Sanchez
        </h3>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getGapClassStyles(gapClass)}`}
        >
          {gapClass}
        </span>
        <p className="text-sm text-zinc-700">
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
          <thead>
            <tr className="border-b border-zinc-200/70 text-left text-zinc-700">
              <th className="px-3 py-2">Snapshot</th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[10].accent }}
              >
                ● Votos
              </th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[10].accent }}
              >
                ↗ Delta
              </th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[35].accent }}
              >
                ● Votos
              </th>
              <th
                className="px-3 py-2"
                style={{ color: CANDIDATE_STYLES[35].accent }}
              >
                ↗ Delta
              </th>
              <th className="px-3 py-2">⚖ Ventaja</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.timestamp} className="border-b border-white/30">
                <td className="px-3 py-2">{formatDateLabel(row.timestamp)}</td>
                <td className="px-3 py-2 font-medium text-zinc-800">
                  {formatNumber(row.votos10)}
                </td>
                <td
                  className={`px-3 py-2 ${row.delta10 >= 0 ? "text-emerald-700" : "text-red-700"}`}
                >
                  {row.delta10 >= 0 ? "▲" : "▼"}{" "}
                  {formatSignedNumber(row.delta10)}
                </td>
                <td className="px-3 py-2 font-medium text-zinc-800">
                  {formatNumber(row.votos35)}
                </td>
                <td
                  className={`px-3 py-2 ${row.delta35 >= 0 ? "text-emerald-700" : "text-red-700"}`}
                >
                  {row.delta35 >= 0 ? "▲" : "▼"}{" "}
                  {formatSignedNumber(row.delta35)}
                </td>
                <td
                  className={`px-3 py-2 font-medium ${row.ventaja >= 0 ? "text-emerald-700" : "text-red-700"}`}
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
