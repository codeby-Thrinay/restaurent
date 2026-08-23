import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const body = await req.json();
    const { status, paymentStatus, paymentMethod } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: updateData,
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // If order payment is marked PAID, optionally reset table status
    if (paymentStatus === 'PAID') {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: 'NEEDS_CLEANING' },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
