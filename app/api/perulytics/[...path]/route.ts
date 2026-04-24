import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!UPSTREAM_BASE_URL) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Falta NEXT_PUBLIC_API_BASE_URL en variables de entorno.",
      },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const upstreamUrl = new URL(
    `${UPSTREAM_BASE_URL.replace(/\/$/, "")}/${path.join("/")}`,
  );
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const payload = await upstreamResponse.text();

    return new NextResponse(payload, {
      status: upstreamResponse.status,
      headers: {
        "content-type":
          upstreamResponse.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "No fue posible conectar con el backend de Perulytics.",
      },
      { status: 502 },
    );
  }
}
