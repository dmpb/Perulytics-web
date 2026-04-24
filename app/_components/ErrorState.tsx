type ErrorStateProps = {
  message: string | null;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <section className="w-full rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h1 className="text-xl font-semibold">No se pudo cargar el dashboard</h1>
        <p className="mt-2">
          {message ?? "La respuesta del backend no contiene datos validos."}
        </p>
        <p className="mt-3 text-sm opacity-80">
          Verifica la variable `NEXT_PUBLIC_API_BASE_URL` y el estado del backend.
        </p>
      </section>
    </main>
  );
}
