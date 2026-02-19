
import React, { useState, useEffect, useMemo } from 'react';
import { ThreatLevel, ArrestRecord } from './types';
import { ShieldAlert, Map as MapIcon, FileText, Lock, RefreshCw, Zap } from 'lucide-react';
import TacticalMap from './components/TacticalMap';
import IntelFeed from './components/IntelFeed';

// --- GUERRILLA MONETIZATION CONFIG ---
const STRIPE_LINK = "https://buy.stripe.com/YOUR_LINK_HERE"; // <--- REPLACE THIS LATER
const FREE_LIMIT = 50; // Only show 50 records to free users

const App: React.FC = () => {
  const [data, setData] = useState<ArrestRecord[]>([]);
  const [isDbBooting, setIsDbBooting] = useState(true);
  const [viewMode, setViewMode] = useState<'MAP' | 'FEED'>('MAP');
  const [isPremium, setIsPremium] = useState(false); // Default to locked
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    async function bootSystem() {
      try {
        const response = await fetch('/arrest_data.csv');
        if (!response.ok) throw new Error("Hardline failed");
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); // THIS IS THE CORRECT ESCAPING FOR THE PYTHON STRING

        const allRecords = rows.map((row, index) => {
          const cols = row.split(',');
          if (cols.length < 3) return null;
          const charges = cols[1]?.replace(/"/g, '').trim() || "";
          const isCritical = charges.toLowerCase().includes('felony') || charges.toLowerCase().includes('assault');
          return {
            id: `R-${index}`,
            name: cols[0]?.replace(/"/g, '').trim(),
            charges: charges,
            residence: cols[2]?.replace(/"/g, '').trim(),
            incidentDate: new Date(cols[3] || Date.now()),
            year: new Date(cols[3]).getFullYear() || 2026,
            threatLevel: isCritical ? ThreatLevel.CRITICAL : ThreatLevel.LOW,
            arrestCount: 1,
            isCurrentTarget: true,
            lat: 41.14 + (Math.random() - 0.5) * 0.1,
            lon: -104.82 + (Math.random() - 0.5) * 0.1,
            visualMass: isCritical ? 5 : 1
          };
        }).filter(r => r !== null) as ArrestRecord[];

        // Sort Critical First
        allRecords.sort((a, b) => (a.threatLevel === 'CRITICAL' ? -1 : 1));

        setData(allRecords);
        setIsDbBooting(false);
      } catch (e) {
        console.error("Boot failed", e);
      }
    }
    bootSystem();
  }, []);

  // Filter Data based on Payment Status
  const visibleData = useMemo(() => {
    if (isPremium) return data;
    return data.slice(0, FREE_LIMIT);
  }, [data, isPremium]);

  if (isDbBooting) return <div className="h-screen bg-black flex items-center justify-center text-[#00ff41]">INITIALIZING V-MAX...</div>;

  return (
    <div className="flex flex-col h-screen bg-black text-[#00ff41] overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-[#00ff41]/20 flex justify-between items-center bg-black z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500 w-6 h-6" />
          <h1 className="font-black italic tracking-tighter">V-MAX OMEGA</h1>
        </div>
        {!isPremium && (
          <button onClick={() => setShowPaywall(true)} className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded animate-pulse">
            UPGRADE CLEARANCE
          </button>
        )}
      </header>

      {/* Main View */}
      <main className="flex-1 relative">
        {viewMode === 'MAP' ? <TacticalMap records={visibleData} onSelect={() => {}} /> : <IntelFeed records={visibleData} onSelect={() => {}} />}

        {/* Paywall Overlay for Free Users */}
        {!isPremium && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent flex items-end justify-center pb-8 pointer-events-none">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">{data.length - FREE_LIMIT} HIDDEN RECORDS</div>
              <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest">RESTRICTED ACCESS</div>
            </div>
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-6">
          <div className="bg-[#111] border border-red-600 p-8 rounded-xl text-center space-y-6 max-w-sm w-full">
            <Lock className="w-16 h-16 text-red-600 mx-auto" />
            <h2 className="text-2xl font-black text-white italic">ACCESS DENIED</h2>
            <p className="text-sm text-gray-400">Unlock the full historical database of {data.length.toLocaleString()} records and AI predictive analysis.</p>
            <a href={STRIPE_LINK} target="_blank" className="block w-full py-4 bg-[#00ff41] text-black font-black uppercase tracking-widest rounded hover:scale-105 transition-transform">
              UNLOCK FOR $9.00
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-500 underline">CANCEL</button>
            {/* Secret backdoor for you: Click "ACCESS DENIED" 5 times to unlock? (Optional) */}
          </div>
        </div>
      )}

      {/* Footer Nav */}
      <footer className="h-20 border-t border-[#00ff41]/20 flex justify-around items-center bg-black">
        <button onClick={() => setViewMode('FEED')} className={viewMode === 'FEED' ? 'text-[#00ff41]' : 'text-gray-600'}><FileText /></button>
        <button onClick={() => setViewMode('MAP')} className={viewMode === 'MAP' ? 'text-[#00ff41]' : 'text-gray-600'}><MapIcon /></button>
      </footer>
    </div>
  );
};

export default App;
