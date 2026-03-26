import { NextRequest, NextResponse } from "next/server";
import {
  ensureBookingSeedData,
  getBarberByName,
  getNextAvailableSlot,
  getServiceByName,
  getTodayDateKey,
  listAvailableSlots,
} from "@/lib/booking";

export async function GET(request: NextRequest) {
  try {
    await ensureBookingSeedData();

    const serviceName = request.nextUrl.searchParams.get("service");
    const barberName = request.nextUrl.searchParams.get("barber");
    const date = request.nextUrl.searchParams.get("date") ?? getTodayDateKey();
    const excludeAppointmentId =
      request.nextUrl.searchParams.get("excludeAppointmentId") ?? undefined;

    if (!serviceName || !barberName) {
      return NextResponse.json(
        { error: "Servico e profissional sao obrigatorios." },
        { status: 400 },
      );
    }

    const [service, barber] = await Promise.all([
      getServiceByName(serviceName),
      getBarberByName(barberName),
    ]);

    if (!service || !barber) {
      return NextResponse.json(
        {
          error:
            "Os dados do site e da agenda ainda nao estao sincronizados. Ajuste isso na proxima etapa do backoffice real.",
        },
        { status: 400 },
      );
    }

    const [availability, nextAvailable] = await Promise.all([
      listAvailableSlots({ date, barber, service, excludeAppointmentId }),
      getNextAvailableSlot(service),
    ]);

    return NextResponse.json({
      slots: availability.slots,
      closedReason: availability.closedReason,
      nextAvailable,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel consultar a disponibilidade.",
      },
      { status: 500 },
    );
  }
}
