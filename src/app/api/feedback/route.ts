import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const feedbackList = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            table: true,
          },
        },
      },
    });

    return NextResponse.json(feedbackList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, rating, comment } = body;

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'orderId and rating required' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        orderId,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}
