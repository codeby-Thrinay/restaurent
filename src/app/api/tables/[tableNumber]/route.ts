import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { tableNumber: string } }) {
  try {
    const num = parseInt(params.tableNumber);
    const table = await prisma.table.findUnique({
      where: { number: num },
      include: {
        orders: {
          where: { paymentStatus: 'UNPAID' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        requests: {
          where: { isResolved: false },
        },
      },
    });

    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error('Error fetching table status', error);
    return NextResponse.json({ error: 'Failed to fetch table status' }, { status: 500 });
  }
}
