import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { institutions } from '@/lib/db/schema';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

// GET - Export institutions to CSV or Excel
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const allInstitutions = await db
      .select()
      .from(institutions)
      .orderBy(institutions.institutionName);

    if (allInstitutions.length === 0) {
      return NextResponse.json(
        { error: 'No institutions to export' },
        { status: 404 }
      );
    }

    // Prepare data
    const data = allInstitutions.map((inst) => ({
      'Institution Name': inst.institutionName,
      'Address': inst.addressLine || '',
      'Post': inst.post || '',
      'District': inst.district || '',
      'PIN': inst.pin || '',
      'Phone': inst.phone || '',
      'Phone 2': inst.phone2 || '',
    }));

    if (format === 'csv') {
      // Export as CSV
      const worksheet = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="institutions.csv"',
        },
      });
    } else {
      // Export as Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Institutions');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="institutions.xlsx"',
        },
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
