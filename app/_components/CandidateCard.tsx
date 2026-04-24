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

  return (
    <article className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <Image
          src={style.photo}
          alt={candidate.nombreCandidato}
          width={52}
          height={52}
          className="h-13 w-13 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
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
  );
}
