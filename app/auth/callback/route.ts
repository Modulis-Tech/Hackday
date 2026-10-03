import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
export async function GET(request: Request) { const url = new URL(request.url); const code = url.searchParams.get("code"); const origin = url.origin; if (!code) return NextResponse.redirect(`${origin}/login`); const cookieStore = await cookies(); const response = NextResponse.redirect(`${origin}/dashboard`); const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => cookieStore.getAll(), setAll: (items: { name: string; value: string; options: CookieOptions }[]) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }); await supabase.auth.exchangeCodeForSession(code); return response; }
