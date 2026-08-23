import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
      include: {
        orders: {
          where: { paymentStatus: 'UNPAID' },
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
          },
        },
        requests: {
          where: { isResolved: false },
        },
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { tableId, status } = body;

    const table = await prisma.table.update({
      where: { id: tableId },
      data: { status },
    });

    return NextResponse.json(table);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update table status' }, { status: 500 });
  }
}
