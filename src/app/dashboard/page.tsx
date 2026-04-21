import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { institutions, fromSettings } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import {
  Building2,
  Settings,
  Upload,
  FileText,
  Download,
  Trash2,
  Plus,
  List,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Get statistics
  const [institutionCount] = await db.select({ count: count() }).from(institutions);
  const [settingsCount] = await db.select({ count: count() }).from(fromSettings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Delivery Slip Generator
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-blue-100">
            Manage your delivery slips efficiently with our modern dashboard
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Institutions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {institutionCount.count}
                </p>
              </div>
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Settings Configured</p>
                <p className="text-3xl font-bold text-gray-900">
                  {settingsCount.count > 0 ? 'Yes' : 'No'}
                </p>
              </div>
              <Settings className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Date</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <FileText className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/settings"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Configure Settings</p>
                <p className="text-sm text-gray-600">Set your office address</p>
              </div>
            </Link>

            <Link
              href="/institutions"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <List className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Manage Institutions</p>
                <p className="text-sm text-gray-600">View, add, edit institutions</p>
              </div>
            </Link>

            <Link
              href="/institutions/import"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Upload className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Import Institutions</p>
                <p className="text-sm text-gray-600">Upload from CSV/Excel</p>
              </div>
            </Link>

            <Link
              href="/slips/select"
              className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Select & Generate</p>
                <p className="text-sm text-gray-600">Create delivery slips</p>
              </div>
            </Link>

            <Link
              href="/institutions"
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <Download className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Export Institutions</p>
                <p className="text-sm text-gray-600">Download as CSV/Excel</p>
              </div>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-gray-900">Manage Settings</p>
                <p className="text-sm text-gray-600">Configure your office details</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
