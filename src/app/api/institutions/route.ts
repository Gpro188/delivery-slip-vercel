import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { institutions } from '@/lib/db/schema';
import { eq, inArray, like, or } from 'drizzle-orm';

// GET - Fetch all institutions or by IDs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids');

    if (ids) {
      const idArray = ids.split(',').map(Number);
      const result = await db
        .select()
        .from(institutions)
        .where(inArray(institutions.id, idArray));
      return NextResponse.json(result);
    }

    const result = await db
      .select()
      .from(institutions)
      .orderBy(institutions.institutionName);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institutions' },
      { status: 500 }
    );
  }
}

// POST - Create new institution
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await db.insert(institutions).values({
      institutionName: body.institutionName,
      addressLine: body.addressLine,
      post: body.post,
      district: body.district,
      pin: body.pin,
      phone: body.phone,
      phone2: body.phone2,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating institution:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Institution already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create institution' },
      { status: 500 }
    );
  }
}

// PUT - Update institution
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const result = await db
      .update(institutions)
      .set({
        institutionName: body.institutionName,
        addressLine: body.addressLine,
        post: body.post,
        district: body.district,
        pin: body.pin,
        phone: body.phone,
        phone2: body.phone2,
        updatedAt: new Date(),
      })
      .where(eq(institutions.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating institution:', error);
    return NextResponse.json(
      { error: 'Failed to update institution' },
      { status: 500 }
    );
  }
}

// DELETE - Delete institution
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    const result = await db
      .delete(institutions)
      .where(eq(institutions.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting institution:', error);
    return NextResponse.json(
      { error: 'Failed to delete institution' },
      { status: 500 }
    );
  }
}
