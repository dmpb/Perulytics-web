export function LoadingState() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="h-20 animate-pulse rounded-2xl bg-slate-200/80" />
      <div className="h-52 animate-pulse rounded-2xl bg-slate-200/80" />
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200/80" />
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200/80" />
    </main>
  );
}
