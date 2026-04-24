export function LoadingState() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="h-24 animate-pulse rounded-xl bg-zinc-200" />
      <div className="h-56 animate-pulse rounded-xl bg-zinc-200" />
      <div className="h-72 animate-pulse rounded-xl bg-zinc-200" />
    </main>
  );
}
