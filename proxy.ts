import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RolesEnum } from "@/src/enums/roles.enums";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo per le rotte admin
  if (pathname.startsWith("/admin")) {
    try {
      const response = NextResponse.next();

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Ottieni il token di autenticazione
      const token = request.cookies.get("supabase-auth-token")?.value ||
                   request.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) {
        const redirectUrl = new URL("/auth/login", request.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Ottieni l'utente dal token
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      // Se non c'è utente o c'è un errore, reindirizza al login
      if (error || !user) {
        const redirectUrl = new URL("/auth/login", request.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Verifica che l'utente abbia il ruolo ADMIN
      const userRole = user.user_metadata?.role;
      if (userRole !== RolesEnum.ADMIN) {
        // Reindirizza alla home se non è admin
        return NextResponse.redirect(new URL("/", request.url));
      }

      return response;
    } catch (error) {
      console.error("Middleware error:", error);
      // In caso di errore, reindirizza alla home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * - public/ (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|public/).*)",
  ],
};
