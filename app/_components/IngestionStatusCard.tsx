import type { IngestionApiResponse } from "../_types/dashboard";
import { formatDateLabel, formatNumber } from "../_utils/format";

type IngestionStatusCardProps = {
  latestSnapshot: NonNullable<IngestionApiResponse["data"]>["latestSnapshot"];
  latestRun: NonNullable<IngestionApiResponse["data"]>["latestRun"];
};

export function IngestionStatusCard({
  latestSnapshot,
  latestRun,
}: IngestionStatusCardProps) {
  return (
    <section className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-zinc-900">
        Estado general de actas
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Resumen visual del avance de conteo del ultimo corte.
      </p>
      <div className="mt-4 rounded-xl border border-sky-100 bg-white/80 p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Actas contabilizadas
            </p>
            <p className="text-3xl font-semibold text-[#046da6]">
              {latestSnapshot?.actasContabilizadas?.toFixed(3) ?? "--"}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Total de actas
            </p>
            <p className="text-xl font-semibold text-zinc-900">
              {formatNumber(latestSnapshot?.totalActas ?? 0)}
            </p>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-sky-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-[#046da6] to-[#67b4de]"
            style={{
              width: `${Math.max(
                0,
                Math.min(100, latestSnapshot?.actasContabilizadas ?? 0),
              )}%`,
            }}
          />
        </div>

        <div className="mt-4 grid gap-3 text-xs text-zinc-700 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
            <p className="font-medium text-zinc-500">Contabilizadas</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {formatNumber(latestSnapshot?.contabilizadas ?? 0)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
            <p className="font-medium text-zinc-500">Para envio al JEE</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {formatNumber(latestSnapshot?.enviadasJee ?? 0)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
            <p className="font-medium text-zinc-500">Pendientes</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {formatNumber(latestSnapshot?.pendientesJee ?? 0)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600">
          <span>Actualizado: {formatDateLabel(latestSnapshot?.timestamp)}</span>
          <span>
            Participacion:{" "}
            {latestSnapshot?.participacionCiudadana?.toFixed(2) ?? "--"}%
          </span>
          <span>
            Votos validos: {formatNumber(latestSnapshot?.totalVotosValidos ?? 0)}
          </span>
          <span>Ingestion: {latestRun?.status ?? "No disponible"}</span>
        </div>
      </div>
    </section>
  );
}
