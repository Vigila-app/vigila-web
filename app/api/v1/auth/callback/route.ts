import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SupabaseConstants } from "@/src/constants/supabase.constants"; // O ovunque tu abbia le costanti

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 1. Accediamo allo store dei cookie di Next.js
  const cookieStore = await cookies();

  // 2. Creiamo un client Supabase "usa e getta" configurato manualmente
  // per scrivere nei cookie di Next.js invece che nel LocalStorage.
  const supabase = createClient(
    SupabaseConstants.authDomain,
    SupabaseConstants.apiKey,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: true,

        // Forniamo un'implementazione sync compatibile con l'API di storage
        storage: {
          getItem: (key: string): string | null => {
            try {
              const c = cookieStore.get(key);
              return c?.value ?? null;
            } catch (e) {
              return null;
            }
          },
          setItem: (key: string, value: string) => {
            try {
              // Next.js cookies().set accetta un oggetto; alcuni campi non sono
              // esattamente quelli che Supabase si aspetta, quindi usiamo `as any`.
              cookieStore.set({
                name: key,
                value: value,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                httpOnly: true,
              } as any);
            } catch (e) {
              // ignore
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.set({ name: key, value: "", path: "/", maxAge: 0 } as any);
            } catch (e) {
              // ignore
            }
          },
        },
      },
    }
  );

  // 3. Scambiamo il codice.
  // Grazie all'oggetto 'storage' che abbiamo definito sopra,
  // Supabase chiamerà automaticamente 'setItem' e scriverà i cookie.
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    // I cookie sono stati settati, possiamo reindirizzare
    return NextResponse.redirect(`${origin}${next}`);
  } else {
    console.error("Callback error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}