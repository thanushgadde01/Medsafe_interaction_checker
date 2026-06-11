import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { deleteCheckHistory } from '@/lib/db-sqlite';

/**
 * DELETE /api/history/[id] - Delete a specific check from history
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    const deleted = deleteCheckHistory(id, userId);

    if (!deleted) {
      return NextResponse.json({ error: 'Record not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Record deleted' });
  } catch (error: any) {
    console.error('History delete error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete history' }, { status: 500 });
  }
}
