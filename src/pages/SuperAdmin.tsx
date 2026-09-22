import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { 
  ShieldCheck, Users, DollarSign, TrendingUp, Sparkles, 
  CheckCircle, XCircle, ExternalLink, Layers, Terminal
} from 'lucide-react';

export const SuperAdmin: React.FC = () => {
  const [templates] = useState([
    {
      id: 101,
      name: 'Figma Premium Coklat-Ai Base Overlay',
      dimensions: '390x844',
      elements_count: 6,
      base_url: 'https://images.unsplash.com/...',
    },
    {
      id: 102,
      name: 'Figma Gold Motion Light',
      dimensions: '390x844',
      elements_count: 8,
      base_url: 'https://images.unsplash.com/...',
    }
  ]);

  const [invitations, setInvitations] = useState([
    {
      id: 'inv-elyana-syahril-001',
      slug: 'elyana-syahril',
      couple: 'Elyana & Syahril',
      status_payment: 'pending',
      created_at: '2024-12-01',
    },
    {
      id: 'inv-anisa-dimas-002',
      slug: 'anisa-dimas',
      couple: 'Anisa & Dimas',
      status_payment: 'settlement',
      created_at: '2024-12-05',
    }
  ]);

  const [notice, setNotice] = useState<string | null>(null);

  const handleTogglePaymentStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'settlement' : 'pending';
    const res = await ApiService.processPaymentWebhook(id, nextStatus as any);
    setNotice(res.message);
    setInvitations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status_payment: nextStatus } : item))
    );
  };

  return (
    <div className="min-h-screen bg-coklat-950 text-coklat-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gold-gradient text-coklat-950 font-bold shadow-gold-glow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gold-gradient">Super Admin CMS Light-Version</h1>
              <p className="text-xs text-coklat-400">Figma-to-CMS Base Templates & Multi-Tenant Payment Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Lighthouse Target &gt; 90
            </span>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card-gold p-6 rounded-2xl border border-gold-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-coklat-300 uppercase">Total Invitations</span>
              <Users className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gold-200">1,890</p>
            <span className="text-[10px] text-emerald-400 mt-1 block">Multi-Tenant Active</span>
          </div>

          <div className="glass-card-gold p-6 rounded-2xl border border-gold-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-coklat-300 uppercase">First Contentful Paint</span>
              <TrendingUp className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gold-200">0.8 Detik</p>
            <span className="text-[10px] text-emerald-400 mt-1 block">Melampaui KPI Target &lt; 1.5s</span>
          </div>

          <div className="glass-card-gold p-6 rounded-2xl border border-gold-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-coklat-300 uppercase">Figma Templates</span>
              <Layers className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gold-200">15 Preset</p>
            <span className="text-[10px] text-coklat-300 mt-1 block">Base Overlay Config JSON</span>
          </div>

          <div className="glass-card-gold p-6 rounded-2xl border border-gold-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-coklat-300 uppercase">Midtrans Webhooks</span>
              <Terminal className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gold-200">Signature Valid</p>
            <span className="text-[10px] text-emerald-400 mt-1 block">Otomasi Removal Watermark</span>
          </div>
        </div>

        {notice && (
          <div className="p-4 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-bold">
            {notice}
          </div>
        )}

        {/* TEMPLATES TABLE */}
        <div className="glass-card p-6 rounded-3xl border border-gold-500/30 space-y-4">
          <h2 className="text-base font-bold text-gold-300 font-serif">Table Templates (Base_Image_URL & Overlay_Config JSON)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-coklat-200">
              <thead className="bg-coklat-900/80 text-gold-300 uppercase text-[10px] tracking-wider border-b border-gold-500/20">
                <tr>
                  <th className="py-3 px-4">Template ID</th>
                  <th className="py-3 px-4">Nama Template Figma</th>
                  <th className="py-3 px-4">Viewport Reference</th>
                  <th className="py-3 px-4">Overlay Elements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-coklat-900/40">
                    <td className="py-3 px-4 font-mono text-gold-300">#{tpl.id}</td>
                    <td className="py-3 px-4 font-bold text-gold-200">{tpl.name}</td>
                    <td className="py-3 px-4 font-mono">{tpl.dimensions} (Mobile)</td>
                    <td className="py-3 px-4">{tpl.elements_count} Items Overlay Config JSON</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVITATIONS & PAYMENTS TABLE */}
        <div className="glass-card p-6 rounded-3xl border border-gold-500/30 space-y-4">
          <h2 className="text-base font-bold text-gold-300 font-serif">Table Invitations & Payment State Machine</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-coklat-200">
              <thead className="bg-coklat-900/80 text-gold-300 uppercase text-[10px] tracking-wider border-b border-gold-500/20">
                <tr>
                  <th className="py-3 px-4">Slug URL</th>
                  <th className="py-3 px-4">Mempelai</th>
                  <th className="py-3 px-4">Status Pembayaran</th>
                  <th className="py-3 px-4 text-right">Midtrans Webhook Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-coklat-900/40">
                    <td className="py-3 px-4 font-mono text-gold-300">{inv.slug}</td>
                    <td className="py-3 px-4 font-bold text-gold-200">{inv.couple}</td>
                    <td className="py-3 px-4">
                      {inv.status_payment === 'settlement' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Settlement (Watermark Off)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[10px]">
                          <XCircle className="w-3.5 h-3.5" /> Pending (Watermark On)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleTogglePaymentStatus(inv.id, inv.status_payment)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          inv.status_payment === 'settlement'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                        }`}
                      >
                        {inv.status_payment === 'settlement' ? 'Trigger Pending' : 'Trigger Settlement'}
                      </button>
                      <a
                        href={`/?slug=${inv.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-coklat-900 border border-gold-500/30 text-[10px] text-gold-300 hover:text-gold-100"
                      >
                        <ExternalLink className="w-3 h-3" /> Preview
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
