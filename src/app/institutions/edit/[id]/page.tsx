'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditInstitutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    institutionName: '',
    addressLine: '',
    post: '',
    district: '',
    pin: '',
    phone: '',
    phone2: '',
  });

  useEffect(() => {
    fetchInstitution();
  }, [params.id]);

  const fetchInstitution = async () => {
    try {
      const response = await fetch(`/api/institutions?ids=${params.id}`);
      const data = await response.json();
      
      if (data.length > 0) {
        const inst = data[0];
        setFormData({
          institutionName: inst.institutionName,
          addressLine: inst.addressLine || '',
          post: inst.post || '',
          district: inst.district || '',
          pin: inst.pin || '',
          phone: inst.phone || '',
          phone2: inst.phone2 || '',
        });
      } else {
        alert('Institution not found');
        router.push('/institutions');
      }
    } catch (error) {
      console.error('Error fetching institution:', error);
      alert('Error loading institution');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/institutions?id=${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Institution updated successfully!');
        router.push('/institutions');
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating institution:', error);
      alert('Error updating institution');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
          <div className="flex items-center gap-4">
            <Link href="/institutions" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Edit className="w-6 h-6" />
              Edit Institution
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Update Institution Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Institution Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, institutionName: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>

            {/* Address Line */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line
              </label>
              <input
                type="text"
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, addressLine: e.target.value }))
                }
                className="input-field"
              />
            </div>

            {/* Post */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post
              </label>
              <input
                type="text"
                value={formData.post}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, post: e.target.value }))
                }
                className="input-field"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, district: e.target.value }))
                }
                className="input-field"
              />
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code
              </label>
              <input
                type="text"
                value={formData.pin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pin: e.target.value }))
                }
                className="input-field"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="input-field"
              />
            </div>

            {/* Phone 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternative Phone
              </label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone2: e.target.value }))
                }
                className="input-field"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Institution'}
              </button>
              <Link href="/institutions" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
