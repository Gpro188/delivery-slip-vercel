'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Institution {
  id: number;
  institutionName: string;
  addressLine: string | null;
  post: string | null;
  district: string | null;
  pin: string | null;
  phone: string | null;
  phone2: string | null;
}

interface Settings {
  institutionName: string;
  place: string;
  district: string;
  pin: string;
  contactNumber: string;
  logoUrl: string;
}

export default function SlipPreviewPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedIds = sessionStorage.getItem('selectedInstitutions');
    if (!selectedIds) {
      router.push('/slips/select');
      return;
    }

    loadData(JSON.parse(selectedIds));
  }, [router]);

  const loadData = async (ids: number[]) => {
    try {
      const [instResponse, settingsResponse] = await Promise.all([
        fetch(`/api/institutions?ids=${ids.join(',')}`),
        fetch('/api/settings'),
      ]);

      const instData = await instResponse.json();
      const settingsData = await settingsResponse.json();

      setInstitutions(instData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/slips/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutions,
          settings,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'delivery-slips.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading slips...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - No Print */}
      <header className="bg-white shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/slips/select" className="btn-secondary">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Delivery Slips Preview
              </h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrint} className="btn-primary">
                <Printer className="w-4 h-4 inline mr-1" />
                Print
              </button>
              <button onClick={handleDownload} className="btn-success">
                <Download className="w-4 h-4 inline mr-1" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Print Preview */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="slip-grid">
          {institutions.map((inst, index) => (
            <div key={inst.id} className="slip-card">
              {/* Index Number Box */}
              <div className="index-box">{index + 1}</div>

              {/* Header Section (FROM) - Centered */}
              <div className="header-section">
                {settings?.logoUrl && (
                  <div className="logo-container">
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="logo"
                    />
                  </div>
                )}
                <p className="from-label">FROM</p>
                <p className="institution-name">
                  {settings?.institutionName || 'INSTITUTION NAME'}
                </p>
                <p className="sender-info text-gray-700">
                  {settings?.place}, {settings?.district} - {settings?.pin}
                </p>
                {settings?.contactNumber && (
                  <p className="sender-info">
                    <span className="font-bold">Ph: </span>
                    {settings.contactNumber}
                  </p>
                )}
              </div>

              {/* TO Box */}
              <div className="to-box">
                <p className="to-label">TO</p>
                <p className="institution-name">
                  {inst.institutionName}
                </p>
                {inst.addressLine && (
                  <p className="address-line">{inst.addressLine}</p>
                )}
                {inst.post && (
                  <p className="detail-item">
                    <span className="detail-label">PO: </span>
                    {inst.post}
                  </p>
                )}
                {inst.district && (
                  <p className="detail-item">
                    <span className="detail-label">DISTRICT: </span>
                    {inst.district}
                  </p>
                )}
                {inst.pin && (
                  <p className="detail-item">
                    <span className="detail-label">PIN: </span>
                    {inst.pin}
                  </p>
                )}
                {(inst.phone || inst.phone2) && (
                  <p className="phone-row">
                    <span className="detail-label">PH: </span>
                    {inst.phone}
                    {inst.phone && inst.phone2 && ' | '}
                    {inst.phone2}
                  </p>
                )}
              </div>

              {/* Date at bottom - pushed to bottom with margin-top: auto */}
              <div className="date-footer">
                <p>
                  <span className="date-label">Date: </span>
                  {new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
