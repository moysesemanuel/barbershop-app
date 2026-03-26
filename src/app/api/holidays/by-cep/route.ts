import { NextRequest, NextResponse } from "next/server";

type BrasilApiCepPayload = {
  cep: string;
  city: string;
  state: string;
  neighborhood?: string;
  street?: string;
};

type BrasilApiHolidayPayload = {
  date: string;
  name: string;
  type?: string;
}[];

function isValidMonth(month: string) {
  return /^\d{4}-\d{2}$/.test(month);
}

function normalizeZipCode(zipCode: string) {
  return zipCode.replace(/\D/g, "");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zipCode = normalizeZipCode(searchParams.get("cep") ?? "");
  const date = searchParams.get("date") ?? "";
  const month = searchParams.get("month") ?? "";

  if (zipCode.length !== 8) {
    return NextResponse.json(
      { error: "Informe um CEP valido com 8 digitos." },
      { status: 400 },
    );
  }

  if (!isValidMonth(month)) {
    return NextResponse.json(
      { error: "Informe um mes valido no formato YYYY-MM." },
      { status: 400 },
    );
  }

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Informe uma data valida no formato YYYY-MM-DD." },
      { status: 400 },
    );
  }

  try {
    const year = month.slice(0, 4);
    const monthPrefix = `${month}-`;

    const [cepResponse, holidaysResponse] = await Promise.all([
      fetch(`https://brasilapi.com.br/api/cep/v1/${zipCode}`, {
        next: { revalidate: 60 * 60 * 24 * 30 },
      }),
      fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`, {
        next: { revalidate: 60 * 60 * 24 * 30 },
      }),
    ]);

    if (!cepResponse.ok) {
      throw new Error("Nao foi possivel consultar o CEP informado.");
    }

    if (!holidaysResponse.ok) {
      throw new Error("Nao foi possivel consultar os feriados deste ano.");
    }

    const cepPayload = (await cepResponse.json()) as BrasilApiCepPayload;
    const holidaysPayload = (await holidaysResponse.json()) as BrasilApiHolidayPayload;
    const holidaysInMonth = holidaysPayload.filter((holiday) => holiday.date.startsWith(monthPrefix));
    const matchedHoliday = date
      ? holidaysPayload.find((holiday) => holiday.date === date) ?? null
      : null;

    return NextResponse.json({
      isHoliday: Boolean(matchedHoliday),
      holidayName: matchedHoliday?.name ?? null,
      holidayType: matchedHoliday?.type ?? null,
      month,
      monthHolidays: holidaysInMonth,
      location: {
        zipCode: cepPayload.cep,
        city: cepPayload.city,
        state: cepPayload.state,
      },
      coverage: matchedHoliday ? "nacional" : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel consultar os feriados para este CEP.",
      },
      { status: 500 },
    );
  }
}
