'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Search, Plus, Edit, Trash2, Download, Upload, FileSpreadsheet } from 'lucide-react';
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

export default function InstitutionsPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this institution?')) return;

    try {
      await fetch(`/api/institutions?id=${id}`, { method: 'DELETE' });
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
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

  const filteredInstitutions = institutions.filter((inst) =>
    inst.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inst.addressLine && inst.addressLine.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
                <Building2 className="w-6 h-6" />
                Institutions
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/institutions/add" className="btn-primary">
                <Plus className="w-4 h-4 inline mr-1" />
                Add Institution
              </Link>
              <Link href="/institutions/import" className="btn-secondary">
                <Upload className="w-4 h-4 inline mr-1" />
                Import
              </Link>
              <Link href="/slips/select" className="btn-success">
                <FileSpreadsheet className="w-4 h-4 inline mr-1" />
                Generate Slips ({selectedIds.length})
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, address, district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredInstitutions.length} of {institutions.length} institutions
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Institution Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Post
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    District
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PIN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInstitutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inst.id)}
                        onChange={(e) => handleSelect(inst.id, e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{inst.institutionName}</td>
                    <td className="px-4 py-3">{inst.addressLine || '-'}</td>
                    <td className="px-4 py-3">{inst.post || '-'}</td>
                    <td className="px-4 py-3">{inst.district || '-'}</td>
                    <td className="px-4 py-3">{inst.pin || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/institutions/edit/${inst.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(inst.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
