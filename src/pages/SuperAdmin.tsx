import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { 
  ShieldCheck, Users, DollarSign, TrendingUp, CheckCircle, XCircle, ExternalLink, Layers, Terminal
} from 'lucide-react';

export const SuperAdmin: React.FC = () => {
  const [templates] = useState([
    {
      id: 101,
      name: 'Minimal White Base Overlay',
      dimensions: '390x844',
      elements_count: 6,
    },
    {
      id: 102,
      name: 'Figma Editorial Light Overlay',
      dimensions: '390x844',
      elements_count: 8,
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
    <div className="min-h-screen bg-white text-gray-900 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gray-900 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-serif">Super Admin CMS Light-Version</h1>
              <p className="text-xs text-gray-500">Minimal White SaaS Control Panel & Multi-Tenant Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium">
              Lighthouse Target &gt; 90
            </span>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-2">
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span>Total Active Tenants</span>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">1,890</p>
            <span className="text-[10px] text-emerald-700 font-medium block">Multi-Tenant Active</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-2">
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span>First Contentful Paint</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">0.8 Detik</p>
            <span className="text-[10px] text-emerald-700 font-medium block">Melampaui Target &lt; 1.5s</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-2">
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span>Figma Presets</span>
              <Layers className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">15 Preset</p>
            <span className="text-[10px] text-gray-500 block">Base Overlay Config JSON</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-2">
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span>Midtrans Webhooks</span>
              <Terminal className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900">Signature Valid</p>
            <span className="text-[10px] text-emerald-700 font-medium block">Otomasi Removal Watermark</span>
          </div>
        </div>

        {notice && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs text-center font-medium">
            {notice}
          </div>
        )}

        {/* TEMPLATES TABLE */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
          <h2 className="text-sm font-bold text-gray-900 font-serif">Table Templates (Base_Image_URL & Overlay_Config JSON)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Template ID</th>
                  <th className="py-3 px-4">Nama Template Figma</th>
                  <th className="py-3 px-4">Viewport Reference</th>
                  <th className="py-3 px-4">Overlay Elements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-gray-900 font-semibold">#{tpl.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{tpl.name}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{tpl.dimensions} (Mobile)</td>
                    <td className="py-3 px-4 text-gray-600">{tpl.elements_count} Items Overlay Config JSON</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVITATIONS & PAYMENTS TABLE */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-minimal space-y-4">
          <h2 className="text-sm font-bold text-gray-900 font-serif">Table Invitations & Payment State Machine</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Slug URL</th>
                  <th className="py-3 px-4">Mempelai</th>
                  <th className="py-3 px-4">Status Pembayaran</th>
                  <th className="py-3 px-4 text-right">Midtrans Webhook Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-gray-900 font-semibold">{inv.slug}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{inv.couple}</td>
                    <td className="py-3 px-4">
                      {inv.status_payment === 'settlement' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[10px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Settlement (Watermark Off)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-800 font-medium text-[10px]">
                          <XCircle className="w-3.5 h-3.5" /> Pending (Watermark On)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleTogglePaymentStatus(inv.id, inv.status_payment)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          inv.status_payment === 'settlement'
                            ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {inv.status_payment === 'settlement' ? 'Trigger Pending' : 'Trigger Settlement'}
                      </button>
                      <a
                        href={`/?slug=${inv.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[10px] text-gray-700 hover:text-gray-900"
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
