"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type ResultsApiResponse = {
  success: boolean;
  data: {
    currentSnapshotTimestamp: string;
    previousSnapshotTimestamp: string;
    results: CandidateResult[];
  };
  error: string | null;
};

type CandidateResult = {
  codigoAgrupacionPolitica: number;
  nombreCandidato: string;
  nombreAgrupacionPolitica: string;
  porcentajeVotosValidos: number;
  totalVotosValidos: number;
  comparativoAnterior: {
    deltaPorcentajeVotosValidos: number;
    deltaVotosValidos: number;
  };
};

type TrendApiResponse = {
  success: boolean;
  data: TrendPoint[];
  error: string | null;
};

type TrendPoint = {
  timestamp: string;
  porcentajeVotosValidos: number;
  totalVotosValidos: number;
};

type IngestionApiResponse = {
  success: boolean;
  data: {
    election?: {
      id: string;
      onpeElectionId: number;
      tipoFiltro: string;
    };
    latestRun?: {
      id: string;
      status: string;
      startedAt: string;
      endedAt: string;
      durationMs: number;
      snapshotCreated: boolean;
      snapshotId: string | null;
      errorMessage: string | null;
    };
    latestSnapshot?: {
      id: string;
      electionId: string;
      timestamp: string;
      actasContabilizadas: number;
      contabilizadas: number;
      totalActas: number;
      participacionCiudadana: number;
      actasEnviadasJee: number;
      enviadasJee: number;
      actasPendientesJee: number;
      pendientesJee: number;
      totalVotosEmitidos: number;
      totalVotosValidos: number;
      createdAt: string;
    };
  };
  error: string | null;
};

type DashboardData = {
  results: ResultsApiResponse["data"];
  trends8: TrendPoint[];
  trends10: TrendPoint[];
  trends35: TrendPoint[];
  ingestion: IngestionApiResponse["data"] | null;
};

const POLLING_MS = 30000;
const CANDIDATE_STYLES: Record<
  number,
  { line: string; accent: string; bg: string; photo: string; logo: string }
> = {
  8: {
    line: "#ee6a08",
    accent: "#ee6a08",
    bg: "bg-orange-50",
    photo: "/assets/candidatos/keiko-fujimori/foto.jpg",
    logo: "/assets/candidatos/keiko-fujimori/logo.jpg",
  },
  10: {
    line: "#5dbd14",
    accent: "#ec0d0d",
    bg: "bg-lime-50",
    photo: "/assets/candidatos/roberto-sanchez/foto.jpg",
    logo: "/assets/candidatos/roberto-sanchez/logo.jpg",
  },
  35: {
    line: "#046da6",
    accent: "#046da6",
    bg: "bg-sky-50",
    photo: "/assets/candidatos/rafael-lopez-aliaga/foto.jpg",
    logo: "/assets/candidatos/rafael-lopez-aliaga/logo.jpg",
  },
};

function formatPercent(value: number): string {
  return `${value.toFixed(3)}%`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-PE").format(value);
}

function formatSignedNumber(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}`;
}

function formatDateLabel(dateString?: string): string {
  if (!dateString) return "No disponible";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No disponible";
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function classifyGap(gap: number): "Muy reñido" | "Cerrado" | "Definido" {
  if (gap < 0.1) return "Muy reñido";
  if (gap < 0.5) return "Cerrado";
  return "Definido";
}

function getGapClassStyles(level: ReturnType<typeof classifyGap>): string {
  if (level === "Muy reñido")
    return "bg-orange-100 text-orange-800 border-orange-300";
  if (level === "Cerrado") return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-emerald-100 text-emerald-800 border-emerald-300";
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${url}`);
  }
  return (await response.json()) as T;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const baseUrl = "/api/perulytics";

  const loadData = useCallback(async () => {
    try {
      const [resultsPayload, trend8Payload, trend10Payload, trend35Payload, ingestionPayload] =
        await Promise.all([
          fetchJson<ResultsApiResponse>(
            `${baseUrl}/analytics/results?codigos=8,10,35`,
          ),
          fetchJson<TrendApiResponse>(
            `${baseUrl}/analytics/trends?codigoAgrupacionPolitica=8&limit=120`,
          ),
          fetchJson<TrendApiResponse>(
            `${baseUrl}/analytics/trends?codigoAgrupacionPolitica=10&limit=120`,
          ),
          fetchJson<TrendApiResponse>(
            `${baseUrl}/analytics/trends?codigoAgrupacionPolitica=35&limit=120`,
          ),
          fetchJson<IngestionApiResponse>(`${baseUrl}/ingestion/status`),
        ]);

      if (
        !resultsPayload.success ||
        !trend8Payload.success ||
        !trend10Payload.success ||
        !trend35Payload.success
      ) {
        throw new Error("El backend devolvio una respuesta invalida.");
      }

      setData({
        results: resultsPayload.data,
        trends8: trend8Payload.data,
        trends10: trend10Payload.data,
        trends35: trend35Payload.data,
        ingestion: ingestionPayload.success ? ingestionPayload.data : null,
      });
      setError(null);
      setLastRefresh(new Date().toISOString());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron obtener los datos del dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      void loadData();
    }, 0);
    const timer = setInterval(() => {
      void loadData();
    }, POLLING_MS);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [loadData]);

  const derived = useMemo(() => {
    if (!data) return null;

    const candidate8 = data.results.results.find(
      (candidate) => candidate.codigoAgrupacionPolitica === 8,
    );
    const candidate10 = data.results.results.find(
      (candidate) => candidate.codigoAgrupacionPolitica === 10,
    );
    const candidate35 = data.results.results.find(
      (candidate) => candidate.codigoAgrupacionPolitica === 35,
    );

    if (!candidate8 || !candidate10 || !candidate35) return null;
    const candidateRows = [candidate8, candidate10, candidate35].sort(
      (a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos,
    );

    const leader = candidate10.porcentajeVotosValidos >= candidate35.porcentajeVotosValidos
      ? candidate10
      : candidate35;
    const follower = leader.codigoAgrupacionPolitica === 10 ? candidate35 : candidate10;
    const gapPercent = Math.abs(
      candidate10.porcentajeVotosValidos - candidate35.porcentajeVotosValidos,
    );
    const gapVotes = Math.abs(candidate10.totalVotosValidos - candidate35.totalVotosValidos);
    const gapClass = classifyGap(gapPercent);
    const momentumDelta =
      candidate10.comparativoAnterior.deltaPorcentajeVotosValidos -
      candidate35.comparativoAnterior.deltaPorcentajeVotosValidos;

    const snapshotCount = Math.min(data.trends10.length, data.trends35.length, 12);
    const trends10Window = [...data.trends10]
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
      .slice(-snapshotCount);
    const trends35Window = [...data.trends35]
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
      .slice(-snapshotCount);

    const vsRows = trends10Window
      .map((trend10, index) => {
        const trend35 = trends35Window[index];
        if (!trend35) return null;

        const previous10 = index === 0 ? null : trends10Window[index - 1];
        const previous35 = index === 0 ? null : trends35Window[index - 1];

        return {
          timestamp: trend10.timestamp,
          votos10: trend10.totalVotosValidos,
          votos35: trend35.totalVotosValidos,
          delta10:
            previous10 === null ? 0 : trend10.totalVotosValidos - previous10.totalVotosValidos,
          delta35:
            previous35 === null ? 0 : trend35.totalVotosValidos - previous35.totalVotosValidos,
          ventaja:
            trend10.totalVotosValidos - trend35.totalVotosValidos,
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    return {
      candidate8,
      candidate10,
      candidate35,
      leader,
      follower,
      gapPercent,
      gapVotes,
      gapClass,
      momentumDelta,
      vsRows,
      candidateRows,
    };
  }, [data]);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
        <div className="h-24 animate-pulse rounded-xl bg-zinc-200" />
        <div className="h-56 animate-pulse rounded-xl bg-zinc-200" />
        <div className="h-72 animate-pulse rounded-xl bg-zinc-200" />
      </main>
    );
  }

  if (error || !data || !derived) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
        <section className="w-full rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-xl font-semibold">No se pudo cargar el dashboard</h1>
          <p className="mt-2">{error ?? "La respuesta del backend no contiene datos validos."}</p>
          <p className="mt-3 text-sm opacity-80">
            Verifica la variable `NEXT_PUBLIC_API_BASE_URL` y el estado del backend.
          </p>
        </section>
      </main>
    );
  }

  const {
    candidate10,
    candidate35,
    leader,
    follower,
    gapPercent,
    gapVotes,
    gapClass,
    momentumDelta,
    vsRows,
    candidateRows,
  } = derived;

  const narrative =
    momentumDelta >= 0
      ? `${candidate10.nombreCandidato} muestra mayor momentum reciente que ${candidate35.nombreCandidato}.`
      : `${candidate35.nombreCandidato} muestra mayor momentum reciente que ${candidate10.nombreCandidato}.`;

  const latestSnapshot = data.ingestion?.latestSnapshot;
  const latestRun = data.ingestion?.latestRun;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 md:px-6">
      <div className="pointer-events-none absolute -left-24 -top-10 h-72 w-72 rounded-full bg-[#ee6a08]/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#5dbd14]/14 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-[#046da6]/14 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
        <nav className="glass-card sticky top-3 z-30 rounded-2xl px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Perulytics | Presidenciales</p>
              <p className="text-xs text-zinc-600">
                Disputa central: {candidate35.nombreCandidato.split(" ").slice(0, 2).join(" ")} vs {candidate10.nombreCandidato.split(" ").slice(0, 2).join(" ")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-700">
              <span className="glass-chip rounded-full px-3 py-1">
                Ultimo snapshot: {formatDateLabel(data.results.currentSnapshotTimestamp)}
              </span>
              <span className="glass-chip rounded-full px-3 py-1">
                Polling {POLLING_MS / 1000}s
              </span>
            </div>
          </div>
        </nav>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-zinc-900">Estado general de actas</h2>
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
              <span>Participacion: {latestSnapshot?.participacionCiudadana?.toFixed(2) ?? "--"}%</span>
              <span>Votos validos: {formatNumber(latestSnapshot?.totalVotosValidos ?? 0)}</span>
              <span>Ingestion: {latestRun?.status ?? "No disponible"}</span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {candidateRows.map((candidate) => (
            <article
              key={candidate.codigoAgrupacionPolitica}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={CANDIDATE_STYLES[candidate.codigoAgrupacionPolitica].photo}
                  alt={candidate.nombreCandidato}
                  width={52}
                  height={52}
                  className="h-13 w-13 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{
                      color:
                        CANDIDATE_STYLES[candidate.codigoAgrupacionPolitica].accent,
                    }}
                  >
                    {candidate.nombreCandidato}
                  </p>
                  <p className="truncate text-xs text-zinc-600">
                    {candidate.nombreAgrupacionPolitica}
                  </p>
                </div>
                <Image
                  src={CANDIDATE_STYLES[candidate.codigoAgrupacionPolitica].logo}
                  alt={`Logo ${candidate.nombreAgrupacionPolitica}`}
                  width={34}
                  height={34}
                  className="ml-auto h-8 w-8 rounded object-cover"
                />
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-900">
                {formatPercent(candidate.porcentajeVotosValidos)}
              </p>
              <p className="text-sm text-zinc-700">
                {formatNumber(candidate.totalVotosValidos)} votos validos
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                Delta snapshot:{" "}
                {formatSignedNumber(candidate.comparativoAnterior.deltaVotosValidos)}
              </p>
            </article>
          ))}
        </section>

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
              Brecha actual: <strong>{formatPercent(gapPercent)}</strong> ({formatNumber(gapVotes)} votos)
            </p>
          </div>
        <p className="mt-1 text-sm text-zinc-600">
          Se muestran los ultimos 12 snapshots con votos acumulados, votos ganados frente al snapshot anterior y ventaja entre ambos.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/40 bg-white/25 p-2 backdrop-blur-md">
          <table className="table-glass min-w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200/70 text-left text-zinc-700">
                <th className="px-3 py-2">Snapshot</th>
                <th className="px-3 py-2" style={{ color: CANDIDATE_STYLES[10].accent }}>● Votos</th>
                <th className="px-3 py-2" style={{ color: CANDIDATE_STYLES[10].accent }}>↗ Delta</th>
                <th className="px-3 py-2" style={{ color: CANDIDATE_STYLES[35].accent }}>● Votos</th>
                <th className="px-3 py-2" style={{ color: CANDIDATE_STYLES[35].accent }}>↗ Delta</th>
                <th className="px-3 py-2">⚖ Ventaja</th>
              </tr>
            </thead>
            <tbody>
              {vsRows.map((row) => (
                <tr key={row.timestamp} className="border-b border-white/30">
                  <td className="px-3 py-2">{formatDateLabel(row.timestamp)}</td>
                  <td className="px-3 py-2 font-medium text-zinc-800">{formatNumber(row.votos10)}</td>
                  <td className={`px-3 py-2 ${row.delta10 >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {row.delta10 >= 0 ? "▲" : "▼"} {formatSignedNumber(row.delta10)}
                  </td>
                  <td className="px-3 py-2 font-medium text-zinc-800">{formatNumber(row.votos35)}</td>
                  <td className={`px-3 py-2 ${row.delta35 >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {row.delta35 >= 0 ? "▲" : "▼"} {formatSignedNumber(row.delta35)}
                  </td>
                  <td className={`px-3 py-2 font-medium ${row.ventaja >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {row.ventaja >= 0 ? "◀" : "▶"} {formatSignedNumber(row.ventaja)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>

        <section className="glass-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-zinc-900">Lectura automatica</h3>
          <p className="mt-2 text-zinc-700">
            <strong>{leader.nombreCandidato}</strong> mantiene la ventaja por el segundo lugar frente a{" "}
            <strong>{follower.nombreCandidato}</strong>, con una brecha actual de{" "}
            <strong>{formatPercent(gapPercent)}</strong>.
          </p>
          <p className="mt-2 text-zinc-700">{narrative}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Ultima actualizacion visual: {formatDateLabel(lastRefresh ?? undefined)}
          </p>
        </section>
      </div>
    </main>
  );
}
