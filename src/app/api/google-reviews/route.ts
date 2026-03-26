import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/google-reviews-adapter";

export async function GET() {
  try {
    const payload = await getGoogleReviews();

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        reviews: [],
        isFallback: false,
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar as avaliações do Google.",
      },
      { status: 500 },
    );
  }
}
