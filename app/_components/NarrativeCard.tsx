import type { CandidateResult } from "../_types/dashboard";
import { formatDateLabel, formatPercent } from "../_utils/format";

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
      <p className="mt-2 text-zinc-700">
        <strong>{leader.nombreCandidato}</strong> mantiene la ventaja por el
        segundo lugar frente a{" "}
        <strong>{follower.nombreCandidato}</strong>, con una brecha actual de{" "}
        <strong>{formatPercent(gapPercent)}</strong>.
      </p>
      <p className="mt-2 text-zinc-700">{narrative}</p>
      <p className="mt-2 text-xs text-zinc-500">
        Ultima actualizacion visual: {formatDateLabel(lastRefresh ?? undefined)}
      </p>
    </section>
  );
}
