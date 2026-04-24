import type { GapLevel } from "../_types/dashboard";

export function classifyGap(gap: number): GapLevel {
  if (gap < 0.1) return "Muy reñido";
  if (gap < 0.5) return "Cerrado";
  return "Definido";
}

export function getGapClassStyles(level: GapLevel): string {
  if (level === "Muy reñido")
    return "bg-orange-100 text-orange-800 border-orange-300";
  if (level === "Cerrado") return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-emerald-100 text-emerald-800 border-emerald-300";
}
