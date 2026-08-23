import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableId, items, notes } = body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: item.id } });
      if (menuItem) {
        const itemTotal = menuItem.price * item.quantity;
        totalAmount += itemTotal;
        orderItemsData.push({
          menuItemId: menuItem.id,
          quantity: item.quantity,
          price: menuItem.price,
          notes: item.notes || null,
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        tableId,
        totalAmount,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // Automatically set Table status to OCCUPIED
    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'OCCUPIED' },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
