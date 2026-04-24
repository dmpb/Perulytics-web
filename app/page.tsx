"use client";

import { CandidatesGrid } from "./_components/CandidatesGrid";
import { DashboardBackdrop } from "./_components/DashboardBackdrop";
import { DashboardNav } from "./_components/DashboardNav";
import { ErrorState } from "./_components/ErrorState";
import { IngestionStatusCard } from "./_components/IngestionStatusCard";
import { LoadingState } from "./_components/LoadingState";
import { NarrativeCard } from "./_components/NarrativeCard";
import { VersusTable } from "./_components/VersusTable";
import { useDashboardData } from "./_hooks/useDashboardData";
import { useDashboardDerived } from "./_hooks/useDashboardDerived";

export default function Home() {
  const { data, isLoading, isRefreshing, error, lastRefresh } =
    useDashboardData();
  const derived = useDashboardDerived(data);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data || !derived) {
    return <ErrorState message={error} />;
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

  const latestSnapshot = data.ingestion?.latestSnapshot;
  const latestRun = data.ingestion?.latestRun;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/80 pb-8 text-slate-900">
      <DashboardBackdrop />

      <DashboardNav
        candidate10={candidate10}
        candidate35={candidate35}
        currentSnapshotTimestamp={data.results.currentSnapshotTimestamp}
        lastRefresh={lastRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-28 md:px-6">
        <IngestionStatusCard
          latestSnapshot={latestSnapshot}
          latestRun={latestRun}
        />

        <CandidatesGrid candidates={candidateRows} />

        <VersusTable
          gapClass={gapClass}
          gapPercent={gapPercent}
          gapVotes={gapVotes}
          rows={vsRows}
        />
      </div>
    </main>
  );
}
