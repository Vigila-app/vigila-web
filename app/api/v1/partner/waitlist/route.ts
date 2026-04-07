import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, fullName, email, phone, consent } = body;

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

    // TODO: persist to database or send notification email when integration is ready
    console.log("[Partner waitlist]", JSON.stringify({ type, fullName, email }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Partner waitlist] Error:", error);
    return NextResponse.json(
      { error: "Errore interno del server." },
      { status: 500 }
    );
  }
}
