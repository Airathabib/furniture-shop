import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4200/graphql";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const headers = new Headers(req.headers);
    headers.set("content-type", "application/json");

    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await backendRes.json();

    const response = NextResponse.json(data, { status: backendRes.status });

    const setCookieHeaders = backendRes.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookieString) => {
        response.headers.append("set-cookie", cookieString);
      });
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown proxy error";

    console.error("Proxy error:", message);
    console.error("❌ Пытаемся достучаться до:", BACKEND_URL);

    return NextResponse.json(
      { errors: [{ message: "Internal Proxy Error" }] },
      { status: 500 },
    );
  }
}
