type ErrorStateProps = {
  message: string | null;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <section className="w-full rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-lg">
        <h1 className="text-xl font-semibold">No se pudo cargar el dashboard</h1>
        <p className="mt-2">
          {message ?? "La respuesta del backend no contiene datos validos."}
        </p>
        <p className="mt-3 text-sm opacity-80">
          Verifica la variable `NEXT_PUBLIC_API_BASE_URL` y el estado del backend.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Reintentar carga
          </button>
          <span className="rounded-lg border border-red-200 bg-white/60 px-3 py-2 text-sm text-red-700">
            Si el error persiste, valida conectividad del backend.
          </span>
        </div>
      </section>
    </main>
  );
}
