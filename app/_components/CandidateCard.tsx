import Image from "next/image";
import { CANDIDATE_STYLES } from "../_constants/candidates";
import type { CandidateResult } from "../_types/dashboard";
import {
  formatNumber,
  formatPercent,
  formatSignedNumber,
} from "../_utils/format";

type CandidateCardProps = {
  candidate: CandidateResult;
};

export function CandidateCard({ candidate }: CandidateCardProps) {
  const style = CANDIDATE_STYLES[candidate.codigoAgrupacionPolitica];
  const isPositiveDelta = candidate.comparativoAnterior.deltaVotosValidos >= 0;

  return (
    <article className="glass-card group overflow-hidden rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.45)]">
      <span
        className="mb-3 block h-1 w-12 rounded-full transition-all duration-200 group-hover:w-16"
        style={{ backgroundColor: style.line }}
      />
      <div className="flex items-center gap-3">
        <Image
          src={style.photo}
          alt={candidate.nombreCandidato}
          width={52}
          height={52}
          className="h-13 w-13 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1 w-0">
          <p
            className="truncate text-xs font-semibold sm:text-sm"
            style={{ color: style.accent }}
          >
            {candidate.nombreCandidato}
          </p>
          <p className="truncate text-xs text-zinc-600">
            {candidate.nombreAgrupacionPolitica}
          </p>
        </div>
        <Image
          src={style.logo}
          alt={`Logo ${candidate.nombreAgrupacionPolitica}`}
          width={34}
          height={34}
          className="ml-auto h-8 w-8 shrink-0 rounded object-cover"
        />
      </div>
      <p className="mt-3 text-2xl font-semibold text-zinc-900">
        {formatPercent(candidate.porcentajeVotosValidos)}
      </p>
      <p className="text-sm text-zinc-700 tabular-nums">
        {formatNumber(candidate.totalVotosValidos)} votos validos
      </p>
      <p
        className={`mt-2 text-xs font-medium tabular-nums ${isPositiveDelta ? "text-emerald-600" : "text-red-500"}`}
      >
        {isPositiveDelta ? "▲" : "▼"} Delta snapshot:{" "}
        {formatSignedNumber(candidate.comparativoAnterior.deltaVotosValidos)}
      </p>
    </article>
  );
}
