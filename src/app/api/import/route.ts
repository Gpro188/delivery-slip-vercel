import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { institutions } from '@/lib/db/schema';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      );
    }

    // Validate and insert data
    const inserted = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      
      try {
        if (!row['Institution Name']) {
          errors.push(`Row ${i + 1}: Missing institution name`);
          continue;
        }

        const result = await db.insert(institutions).values({
          institutionName: row['Institution Name'],
          addressLine: row['Address'] || row['address'] || null,
          post: row['Post'] || row['post'] || null,
          district: row['District'] || row['district'] || null,
          pin: String(row['PIN'] || row['pin'] || ''),
          phone: String(row['Phone'] || row['phone'] || ''),
          phone2: String(row['Phone2'] || row['phone2'] || ''),
        }).returning();

        inserted.push(result[0]);
      } catch (error: any) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      inserted: inserted.length,
      errors,
      message: `Successfully imported ${inserted.length} institutions`,
    });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
}
