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
  const runStatus = latestRun?.status ?? "No disponible";
  const actasContabilizadas = latestSnapshot?.actasContabilizadas ?? 0;
  const progressPalette = {
    trackClass: "bg-sky-100 border-sky-300",
    fillClass: "bg-sky-700",
    headingValueClass: "text-sky-700",
    legendTones: [
      {
        cardClass: "border-blue-200 bg-blue-50",
        valueClass: "text-sky-800",
        dotClass: "bg-sky-700",
      },
      {
        cardClass: "border-blue-200 bg-blue-50",
        valueClass: "text-sky-800",
        dotClass: "bg-sky-100",
      },
      {
        cardClass: "border-blue-200 bg-blue-50",
        valueClass: "text-sky-800",
        dotClass: "bg-slate-400",
      },
    ],
  };
  const metricCards = [
    {
      label: "Contabilizadas",
      value: formatNumber(latestSnapshot?.contabilizadas ?? 0),
      tone: progressPalette.legendTones[0],
    },
    {
      label: "Para envio al JEE",
      value: formatNumber(latestSnapshot?.enviadasJee ?? 0),
      tone: progressPalette.legendTones[1],
    },
    {
      label: "Pendientes",
      value: formatNumber(latestSnapshot?.pendientesJee ?? 0),
      tone: progressPalette.legendTones[2],
    },
  ];

  return (
    <section className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-zinc-900">
        Estado general de actas
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Resumen visual del avance de conteo del ultimo corte.
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Actas contabilizadas
            </p>
            <p
              className={`text-3xl font-semibold tabular-nums ${progressPalette.headingValueClass}`}
            >
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

        <div
          className={`mt-4 h-3 overflow-hidden rounded-full border ${progressPalette.trackClass}`}
        >
          <div
            className={`h-full rounded-full ${progressPalette.fillClass}`}
            style={{
              width: `${Math.max(
                0,
                Math.min(100, actasContabilizadas),
              )}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-700">
          {metricCards.map((metric) => (
            <div
              key={metric.label}
              className={`inline-flex items-center gap-2 px-0`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full border border-sky-800 ${metric.tone.dotClass}`}
              />
              <span className="font-semibold text-zinc-700">{metric.label}:</span>
              <span
                className={`font-bold tabular-nums ${metric.tone.valueClass}`}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600 items-center">
          <span>Actualizado: {formatDateLabel(latestSnapshot?.timestamp)}</span>
          <span>
            Participacion:{" "}
            {latestSnapshot?.participacionCiudadana?.toFixed(2) ?? "--"}%
          </span>
          <span>
            Votos validos: {formatNumber(latestSnapshot?.totalVotosValidos ?? 0)}
          </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white/80 px-2 py-0.5">
                Ingestion:
                <strong className="font-semibold text-zinc-700">{runStatus}</strong>
              </span>
        </div>
    </section>
  );
}
