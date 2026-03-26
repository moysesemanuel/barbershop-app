import { NextRequest, NextResponse } from "next/server";
import { syncOperationalData } from "@/lib/admin-sync";
import { ensureBookingSeedData } from "@/lib/booking";
import type { SiteConfig } from "@/components/shared/site-config";

export async function POST(request: NextRequest) {
  try {
    await ensureBookingSeedData();
    const body = (await request.json()) as { config?: SiteConfig };

    if (!body.config) {
      return NextResponse.json(
        { error: "Configuracao do site nao enviada." },
        { status: 400 },
      );
    }

    await syncOperationalData(body.config);

    return NextResponse.json({
      message: "Dados operacionais sincronizados com a agenda.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel sincronizar os dados operacionais.",
      },
      { status: 500 },
    );
  }
}
