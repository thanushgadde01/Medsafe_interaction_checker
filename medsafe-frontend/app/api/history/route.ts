import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { getUserCheckHistory, saveCheckHistory } from '@/lib/db-sqlite';
import type { CheckHistory } from '@/types';

/**
 * GET /api/history - Retrieve user's check history
 */
export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const limit = request.nextUrl.searchParams.get('limit') || '50';
    const history = getUserCheckHistory(userId, parseInt(limit));

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error('History retrieval error:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve history' }, { status: 500 });
  }
}

/**
 * POST /api/history - Save a new check to history
 */
export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newRecord: Omit<CheckHistory, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      drugName: body.drugName,
      foodName: body.foodName,
      drugSmiles: body.drugSmiles,
      foodSmiles: body.foodSmiles,
      clinicalText: body.clinicalText,
      result: body.result,
    };

    const saved = saveCheckHistory(newRecord);

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    console.error('History save error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save history' }, { status: 500 });
  }
}
