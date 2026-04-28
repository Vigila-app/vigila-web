import { NextRequest, NextResponse } from "next/server";
import altcha from "altcha-lib";
import { getAdminClient, jsonErrorResponse } from "@/server/api.utils.server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, captcha, fullName, email, phone, consent, ...rest } = body;

    if (!type || !fullName || !email || !phone || !consent) {
      return NextResponse.json(
        { error: "Parametri obbligatori mancanti." },
        { status: 400 }
      );
    }

    if (!["caf", "cliniche"].includes(type)) {
      return NextResponse.json(
        { error: "Tipo di partner non valido." },
        { status: 400 }
      );
    }

    // Verify Altcha captcha
    if (!captcha) {
      return NextResponse.json(
        { error: "Verifica anti-bot richiesta." },
        { status: 400 }
      );
    }

    const captchaOk = await altcha.verifySolution(
      captcha,
      process.env.ALTCHA_HMAC_KEY as string
    );

    if (!captchaOk) {
      return NextResponse.json(
        { error: "Verifica anti-bot non valida. Riprova." },
        { status: 401 }
      );
    }

    // Persist to partner_waitlist table
    const _admin = getAdminClient();
    const { error: dbError } = await _admin.from("partner_waitlist").insert({
      type,
      data: { fullName, email, phone, consent, ...rest },
    });

    if (dbError) {
      console.error("[Partner waitlist] DB error:", dbError);
      return jsonErrorResponse(500, {
        error: "Errore nel salvataggio dei dati.",
        success: false,
      } as any);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Partner waitlist] Error:", error);
    return NextResponse.json(
      { error: "Errore interno del server." },
      { status: 500 }
    );
  }
}
