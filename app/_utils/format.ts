export function formatPercent(value: number): string {
  return `${value.toFixed(3)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-PE").format(value);
}

export function formatSignedNumber(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}`;
}

export function formatDateLabel(dateString?: string): string {
  if (!dateString) return "No disponible";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No disponible";
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

export function formatRelativeSeconds(dateString?: string | null): string {
  if (!dateString) return "sin referencia";
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "sin referencia";
  const deltaSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  return `hace ${deltaSeconds}s`;
}
