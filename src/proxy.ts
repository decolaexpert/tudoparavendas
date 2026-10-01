import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/api/webhooks/hotmart"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));
  const isStaticAsset = request.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|ico|css|js)$/);

  if (!user && !isPublic && !isStaticAsset) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sessão única por conta: se essa sessão não é mais a mais recente (a
  // conta fez login em outro dispositivo depois), derruba essa aqui.
  if (user && !isPublic && !isStaticAsset) {
    const { data: claimsData } = await supabase.auth.getClaims();
    const sessionId = claimsData?.claims.session_id;

    if (sessionId) {
      const { data: member } = await supabase
        .from("members")
        .select("active_session_id")
        .eq("email", user.email)
        .maybeSingle();

      if (member?.active_session_id && member.active_session_id !== sessionId) {
        await supabase.auth.signOut();
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("reason", "session_replaced");
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
