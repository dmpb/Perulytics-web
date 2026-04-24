"use client";

import { useMemo } from "react";
import type { DashboardData, DashboardDerived } from "../_types/dashboard";
import { classifyGap } from "../_utils/gap";

export function useDashboardDerived(
  data: DashboardData | null,
): DashboardDerived | null {
  return useMemo(() => {
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

    const leader =
      candidate10.porcentajeVotosValidos >= candidate35.porcentajeVotosValidos
        ? candidate10
        : candidate35;
    const follower =
      leader.codigoAgrupacionPolitica === 10 ? candidate35 : candidate10;
    const gapPercent = Math.abs(
      candidate10.porcentajeVotosValidos - candidate35.porcentajeVotosValidos,
    );
    const gapVotes = Math.abs(
      candidate10.totalVotosValidos - candidate35.totalVotosValidos,
    );
    const gapClass = classifyGap(gapPercent);
    const momentumDelta =
      candidate10.comparativoAnterior.deltaPorcentajeVotosValidos -
      candidate35.comparativoAnterior.deltaPorcentajeVotosValidos;

    const snapshotCount = Math.min(
      data.trends10.length,
      data.trends35.length,
      12,
    );
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
            previous10 === null
              ? 0
              : trend10.totalVotosValidos - previous10.totalVotosValidos,
          delta35:
            previous35 === null
              ? 0
              : trend35.totalVotosValidos - previous35.totalVotosValidos,
          ventaja: trend10.totalVotosValidos - trend35.totalVotosValidos,
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
}
