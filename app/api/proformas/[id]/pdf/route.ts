import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getProformaForUser } from "@/lib/actions/proformas";
import { ProformaPdfDocument } from "@/components/pdf/ProformaPdfDocument";
import React from "react";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const proforma = await getProformaForUser(id);
  if (!proforma) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const doc = React.createElement(ProformaPdfDocument, { proforma });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(doc as any);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="proforma-${proforma.proformaNumber}.pdf"`,
      },
    });
  } catch (e) {
    console.error("PDF generation failed:", e);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
