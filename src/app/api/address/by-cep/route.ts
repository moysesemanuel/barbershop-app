import { NextRequest, NextResponse } from "next/server";

type BrasilApiCepPayload = {
  cep: string;
  city: string;
  state: string;
  neighborhood?: string;
  street?: string;
};

function normalizeZipCode(zipCode: string) {
  return zipCode.replace(/\D/g, "");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zipCode = normalizeZipCode(searchParams.get("cep") ?? "");

  if (zipCode.length !== 8) {
    return NextResponse.json(
      { error: "Informe um CEP valido com 8 digitos." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${zipCode}`, {
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel consultar o CEP informado.");
    }

    const payload = (await response.json()) as BrasilApiCepPayload;

    return NextResponse.json({
      zipCode: payload.cep,
      street: payload.street ?? "",
      neighborhood: payload.neighborhood ?? "",
      city: payload.city,
      state: payload.state,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel consultar o endereco para este CEP.",
      },
      { status: 500 },
    );
  }
}
