import React, { useState } from 'react';
import { ViewMode } from './types';
import { PublicInvitation } from './pages/PublicInvitation';
import { ClientDashboard } from './pages/ClientDashboard';
import { SuperAdmin } from './pages/SuperAdmin';
import { Layout, ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('public');

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      {/* MINIMALIST TOP NAV BAR */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-50 text-xs shadow-minimal">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 tracking-tight">CMS Undangan Digital</span>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-mono border border-gray-200">Minimal White</span>
        </div>

        {/* ROLE SWITCHER BUTTONS */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setViewMode('public')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'public'
                ? 'bg-white text-gray-900 shadow-minimal font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-gray-600" />
            Public Viewer
          </button>

          <button
            onClick={() => setViewMode('client')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'client'
                ? 'bg-white text-gray-900 shadow-minimal font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5 text-gray-600" />
            Client Dashboard
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'admin'
                ? 'bg-white text-gray-900 shadow-minimal font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
            Super Admin
          </button>
        </div>
      </nav>

      {/* VIEW RENDERER */}
      <main className="flex-1 bg-white">
        {viewMode === 'public' && <PublicInvitation slug="elyana-syahril" />}
        {viewMode === 'client' && <ClientDashboard />}
        {viewMode === 'admin' && <SuperAdmin />}
      </main>
    </div>
  );
};
