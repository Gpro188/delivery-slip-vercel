'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileSpreadsheet, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        alert(`Successfully imported ${data.inserted} institutions!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSample = () => {
    // Create sample CSV
    const sampleData = `Institution Name,Address,Post,District,PIN,Phone,Phone2
ABC College,123 Main Street,Central,Kolkata,700001,9876543210,
XYZ School,456 Park Avenue,North,Kolkata,700002,9876543211,`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-institutions.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
              <Upload className="w-6 h-6" />
              Import Institutions
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upload CSV or Excel File</h2>

          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• File must be CSV or Excel (.xlsx) format</li>
                <li>• Required column: "Institution Name"</li>
                <li>• Optional columns: Address, Post, District, PIN, Phone, Phone2</li>
                <li>• First row should be headers</li>
              </ul>
            </div>

            {/* Download Sample */}
            <button
              onClick={handleDownloadSample}
              className="btn-secondary w-full"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Download Sample CSV
            </button>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn-primary cursor-pointer"
              >
                Select File
              </label>
              {file && (
                <p className="mt-4 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-success w-full"
            >
              {uploading ? 'Uploading...' : 'Upload & Import'}
            </button>

            {/* Result */}
            {result && (
              <div className={`rounded-lg p-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-semibold">
                  {result.success ? '✅ Success!' : '❌ Error'}
                </p>
                <p className="text-sm mt-2">{result.message}</p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Errors:</p>
                    <ul className="text-sm text-red-600">
                      {result.errors.slice(0, 5).map((err: string, i: number) => (
                        <li key={i}>• {err}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>... and {result.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
