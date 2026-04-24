"use client";

import { useCallback, useEffect, useState } from "react";
import { POLLING_MS } from "../_constants/candidates";
import type {
  DashboardData,
  IngestionApiResponse,
  ResultsApiResponse,
  TrendApiResponse,
} from "../_types/dashboard";
import { fetchJson } from "../_utils/fetch";

type UseDashboardDataResult = {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: string | null;
};

export function useDashboardData(
  baseUrl: string = "/api/perulytics",
): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [
        resultsPayload,
        trend8Payload,
        trend10Payload,
        trend35Payload,
        ingestionPayload,
      ] = await Promise.all([
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

  return { data, isLoading, error, lastRefresh };
}
