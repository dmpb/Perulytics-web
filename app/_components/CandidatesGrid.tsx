import type { CandidateResult } from "../_types/dashboard";
import { CandidateCard } from "./CandidateCard";

type CandidatesGridProps = {
  candidates: CandidateResult[];
};

export function CandidatesGrid({ candidates }: CandidatesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.codigoAgrupacionPolitica}
          candidate={candidate}
        />
      ))}
    </div>
  );
}
