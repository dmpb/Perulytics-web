import type { CandidateResult } from "../_types/dashboard";
import { formatDateLabel, formatPercent, formatSignedNumber } from "../_utils/format";

type NarrativeCardProps = {
  leader: CandidateResult;
  follower: CandidateResult;
  gapPercent: number;
  momentumDelta: number;
  candidate10: CandidateResult;
  candidate35: CandidateResult;
  lastRefresh: string | null;
};

export function NarrativeCard({
  leader,
  follower,
  gapPercent,
  momentumDelta,
  candidate10,
  candidate35,
  lastRefresh,
}: NarrativeCardProps) {
  const narrative =
    momentumDelta >= 0
      ? `${candidate10.nombreCandidato} muestra mayor momentum reciente que ${candidate35.nombreCandidato}.`
      : `${candidate35.nombreCandidato} muestra mayor momentum reciente que ${candidate10.nombreCandidato}.`;

  return (
    <section className="glass-card rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-zinc-900">Lectura automatica</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white/70 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Que paso</p>
          <p className="mt-1 text-sm text-zinc-800">
            <strong>{leader.nombreCandidato}</strong> mantiene la ventaja sobre{" "}
            <strong>{follower.nombreCandidato}</strong> por{" "}
            <strong>{formatPercent(gapPercent)}</strong>.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white/70 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Que significa</p>
          <p className="mt-1 text-sm text-zinc-800">{narrative}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white/70 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Que vigilar</p>
          <p className="mt-1 text-sm text-zinc-800 tabular-nums">
            Momentum relativo: {formatSignedNumber(momentumDelta)} p.p. en el ultimo snapshot.
          </p>
        </article>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Ultima actualizacion visual: {formatDateLabel(lastRefresh ?? undefined)}
      </p>
    </section>
  );
}
