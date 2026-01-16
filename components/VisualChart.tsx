import React, { useMemo } from 'react';
import { STAR_DATA } from '../data';
import { LacanRealm, StarMapping, StarCategory, Language } from '../types';

interface VisualChartProps {
  onSelectStar: (star: StarMapping) => void;
  selectedId: string | null;
  filter: StarCategory | 'ALL';
  lang: Language;
}

const VisualChart: React.FC<VisualChartProps> = ({ onSelectStar, selectedId, filter, lang }) => {
  // Define localization helper based on current language
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  const realms = {
    [LacanRealm.REAL]: { x: 400, y: 180, color: '#ef4444', label: lang === 'zh' ? '实在界 (The Real)' : 'The Real' },
    [LacanRealm.SYMBOLIC]: { x: 250, y: 480, color: '#3b82f6', label: lang === 'zh' ? '象征界 (The Symbolic)' : 'The Symbolic' },
    [LacanRealm.IMAGINARY]: { x: 550, y: 480, color: '#10b981', label: lang === 'zh' ? '想象界 (The Imaginary)' : 'The Imaginary' },
  };

  const positions = useMemo(() => {
    const realmCounts: Record<string, number> = {};
    return STAR_DATA.map((star) => {
      const realm = realms[star.realm];
      const count = realmCounts[star.realm] || 0;
      realmCounts[star.realm] = count + 1;
      
      const angle = (count * 45 * Math.PI) / 180 + (star.realm === LacanRealm.REAL ? -Math.PI/2 : 0);
      const radius = 60 + (count * 15);
      
      return {
        ...star,
        x: realm.x + Math.cos(angle) * radius,
        y: realm.y + Math.sin(angle) * radius,
      };
    });
  }, [lang]);

  const visibleStars = useMemo(() => {
    return positions.filter(s => filter === 'ALL' || s.category === filter);
  }, [positions, filter]);

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
      <svg viewBox="0 0 800 650" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Borromean Link Background */}
        <path d="M 400 180 L 250 480 L 550 480 Z" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="10,5" className="opacity-30" />
        
        {Object.entries(realms).map(([key, r]) => (
          <g key={key}>
            <circle cx={r.x} cy={r.y} r="160" fill={r.color} fillOpacity="0.03" stroke={r.color} strokeOpacity="0.1" strokeWidth="2" />
            <circle cx={r.x} cy={r.y} r="5" fill={r.color} className="animate-pulse" />
            <text x={r.x} y={r.y - 180} textAnchor="middle" fill={r.color} className="text-[12px] font-black tracking-[0.3em] uppercase opacity-40">
              {r.label}
            </text>
          </g>
        ))}

        {/* Connections for selected star */}
        {selectedId && visibleStars.find(s => s.id === selectedId) && (
          <g className="animate-in fade-in duration-500">
            {Object.values(realms).map((r, idx) => {
              const star = visibleStars.find(s => s.id === selectedId)!;
              return (
                <line 
                  key={idx} 
                  x1={star.x} y1={star.y} x2={r.x} y2={r.y} 
                  stroke={star.color} strokeWidth="1" strokeDasharray="4,4" opacity="0.3"
                />
              );
            })}
          </g>
        )}

        {visibleStars.map((star) => (
          <g 
            key={star.id} 
            className="cursor-pointer transition-all duration-500"
            onClick={() => onSelectStar(star)}
            style={{ opacity: selectedId && selectedId !== star.id ? 0.2 : 1 }}
          >
            <circle 
              cx={star.x} 
              cy={star.y} 
              r={selectedId === star.id ? 15 : 7} 
              fill={star.color}
              className={`transition-all duration-500 ${selectedId === star.id ? 'filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}
            />
            <text 
              x={star.x} 
              y={star.y + 24} 
              textAnchor="middle" 
              fill="white" 
              className={`text-[10px] font-bold tracking-tighter transition-all duration-300 ${selectedId === star.id ? 'text-[12px] fill-white' : 'fill-slate-500'}`}
              style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
            >
              {star.name[lang]}
            </text>
          </g>
        ))}
      </svg>
      
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1 pointer-events-none">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t('拉康拓扑结构', 'Lacanian Topology')}</div>
        <div className="text-[8px] text-slate-700 italic">{t('实在 (R) - 象征 (S) - 想象 (I)', 'Real - Symbolic - Imaginary')}</div>
      </div>
    </div>
  );
};

export default VisualChart;