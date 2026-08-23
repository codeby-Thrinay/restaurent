import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const requests = await prisma.waiterRequest.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: 'asc' },
      include: {
        table: true,
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableId, type } = body; // type: WATER, CUTLERY, HELP, BILL

    if (!tableId || !type) {
      return NextResponse.json({ error: 'tableId and type are required' }, { status: 400 });
    }

    const waiterRequest = await prisma.waiterRequest.create({
      data: {
        tableId,
        type,
      },
      include: {
        table: true,
      },
    });

    // Update table status if BILL is requested
    if (type === 'BILL') {
      await prisma.table.update({
        where: { id: tableId },
        data: { status: 'BILL_REQUESTED' },
      });
    }

    return NextResponse.json(waiterRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dispatch request' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { requestId } = body;

    const updated = await prisma.waiterRequest.update({
      where: { id: requestId },
      data: { isResolved: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve request' }, { status: 500 });
  }
}
