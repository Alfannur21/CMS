import React, { useState } from 'react';
import { ViewMode } from './types';
import { PublicInvitation } from './pages/PublicInvitation';
import { ClientDashboard } from './pages/ClientDashboard';
import { SuperAdmin } from './pages/SuperAdmin';
import { Sparkles, Layout, ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('public');

  return (
    <div className="min-h-screen flex flex-col bg-coklat-950 font-sans">
      {/* SUPER UTILITY BAR: SWITCH PRD ROLES */}
      <nav className="bg-coklat-900 border-b border-gold-500/30 px-4 py-2 flex items-center justify-between sticky top-0 z-50 text-xs shadow-luxury">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          <span className="font-bold text-gold-gradient hidden sm:inline">Platform SaaS Undangan 3D Motion</span>
          <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-mono">v1.0 PRD</span>
        </div>

        {/* ROLE SWITCHER BUTTONS */}
        <div className="flex items-center bg-coklat-950 p-1 rounded-xl border border-gold-500/20">
          <button
            onClick={() => setViewMode('public')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'public'
                ? 'bg-gold-gradient text-coklat-950 shadow-gold-glow'
                : 'text-coklat-300 hover:text-gold-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Public Viewer (3D)
          </button>

          <button
            onClick={() => setViewMode('client')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'client'
                ? 'bg-gold-gradient text-coklat-950 shadow-gold-glow'
                : 'text-coklat-300 hover:text-gold-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            Client Dashboard
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'admin'
                ? 'bg-gold-gradient text-coklat-950 shadow-gold-glow'
                : 'text-coklat-300 hover:text-gold-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin
          </button>
        </div>
      </nav>

      {/* VIEW RENDERER */}
      <main className="flex-1">
        {viewMode === 'public' && <PublicInvitation slug="elyana-syahril" />}
        {viewMode === 'client' && <ClientDashboard />}
        {viewMode === 'admin' && <SuperAdmin />}
      </main>
    </div>
  );
};
