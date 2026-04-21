import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fromSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch settings
export async function GET(req: NextRequest) {
  try {
    const result = await db.select().from(fromSettings).limit(1);
    
    if (result.length === 0) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if settings exist
    const existing = await db.select().from(fromSettings).limit(1);

    if (existing.length > 0) {
      // Update existing
      const result = await db
        .update(fromSettings)
        .set({
          institutionName: body.institutionName,
          place: body.place,
          district: body.district,
          pin: body.pin,
          contactNumber: body.contactNumber,
          logoUrl: body.logoUrl,
          updatedAt: new Date(),
        })
        .where(eq(fromSettings.id, existing[0].id))
        .returning();

      return NextResponse.json(result[0]);
    } else {
      // Insert new
      const result = await db
        .insert(fromSettings)
        .values({
          institutionName: body.institutionName,
          place: body.place,
          district: body.district,
          pin: body.pin,
          contactNumber: body.contactNumber,
          logoUrl: body.logoUrl,
        })
        .returning();

      return NextResponse.json(result[0], { status: 201 });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
