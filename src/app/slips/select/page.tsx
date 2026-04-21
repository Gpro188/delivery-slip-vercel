'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet, Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface Institution {
  id: number;
  institutionName: string;
  addressLine: string | null;
  post: string | null;
  district: string | null;
  pin: string | null;
}

export default function SlipSelectPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/institutions');
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(institutions.map((inst) => inst.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleGenerate = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one institution');
      return;
    }

    // Store selected IDs in session storage
    sessionStorage.setItem('selectedInstitutions', JSON.stringify(selectedIds));
    router.push('/slips/preview');
  };

  const filteredInstitutions = institutions.filter((inst) =>
    inst.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inst.district && inst.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="btn-secondary">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6" />
                Select Institutions for Delivery Slips
              </h1>
            </div>
            <button
              onClick={handleGenerate}
              className="btn-success"
              disabled={selectedIds.length === 0}
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Generate Slips ({selectedIds.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Selected: {selectedIds.length} institutions
          </div>
        </div>

        {/* Institution List */}
        <div className="card">
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Select All</span>
            </label>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredInstitutions.map((inst) => (
              <label
                key={inst.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(inst.id)}
                  onChange={(e) => handleSelect(inst.id, e.target.checked)}
                  className="w-4 h-4 mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{inst.institutionName}</p>
                  <p className="text-sm text-gray-600">
                    {[inst.addressLine, inst.post, inst.district, inst.pin]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
