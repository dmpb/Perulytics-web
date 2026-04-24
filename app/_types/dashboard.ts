export type ResultsApiResponse = {
  success: boolean;
  data: {
    currentSnapshotTimestamp: string;
    previousSnapshotTimestamp: string;
    results: CandidateResult[];
  };
  error: string | null;
};

export type CandidateResult = {
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

export type TrendApiResponse = {
  success: boolean;
  data: TrendPoint[];
  error: string | null;
};

export type TrendPoint = {
  timestamp: string;
  porcentajeVotosValidos: number;
  totalVotosValidos: number;
};

export type IngestionApiResponse = {
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

export type DashboardData = {
  results: ResultsApiResponse["data"];
  trends8: TrendPoint[];
  trends10: TrendPoint[];
  trends35: TrendPoint[];
  ingestion: IngestionApiResponse["data"] | null;
};

export type VersusRow = {
  timestamp: string;
  votos10: number;
  votos35: number;
  delta10: number;
  delta35: number;
  ventaja: number;
};

export type GapLevel = "Muy reñido" | "Cerrado" | "Definido";

export type DashboardDerived = {
  candidate8: CandidateResult;
  candidate10: CandidateResult;
  candidate35: CandidateResult;
  leader: CandidateResult;
  follower: CandidateResult;
  gapPercent: number;
  gapVotes: number;
  gapClass: GapLevel;
  momentumDelta: number;
  vsRows: VersusRow[];
  candidateRows: CandidateResult[];
};
