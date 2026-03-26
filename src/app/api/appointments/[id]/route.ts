import { AppointmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureBookingSeedData, rescheduleAppointment } from "@/lib/booking";

const allowedStatus = new Set<AppointmentStatus>([
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureBookingSeedData();
    const { id } = await params;
    const body = (await request.json()) as {
      status?: AppointmentStatus;
      date?: string;
      time?: string;
    };

    if (body.date && body.time) {
      const appointment = await rescheduleAppointment({
        appointmentId: id,
        date: body.date,
        time: body.time,
      });

      return NextResponse.json({
        id: appointment.id,
        status: appointment.status,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        message: "Agendamento remarcado com sucesso.",
      });
    }

    if (!body.status || !allowedStatus.has(body.status)) {
      return NextResponse.json(
        { error: "Status invalido para atualizacao." },
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      id: appointment.id,
      status: appointment.status,
      message: "Agendamento atualizado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar o agendamento.",
      },
      { status: 500 },
    );
  }
}
