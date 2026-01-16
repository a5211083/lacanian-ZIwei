
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
  const realms = {
    [LacanRealm.REAL]: { x: 400, y: 150, color: '#ef4444', label: lang === 'zh' ? '实在界 (The Real)' : 'The Real' },
    [LacanRealm.SYMBOLIC]: { x: 200, y: 500, color: '#3b82f6', label: lang === 'zh' ? '象征界 (The Symbolic)' : 'The Symbolic' },
    [LacanRealm.IMAGINARY]: { x: 600, y: 500, color: '#10b981', label: lang === 'zh' ? '想象界 (The Imaginary)' : 'The Imaginary' },
  };

  const positions = useMemo(() => {
    const realmCounts: Record<string, number> = {};
    return STAR_DATA.map((star) => {
      const realm = realms[star.realm];
      const count = realmCounts[star.realm] || 0;
      realmCounts[star.realm] = count + 1;
      
      const angle = (count * 137.5 * Math.PI) / 180;
      const radius = 50 + (count * 12);
      
      return {
        ...star,
        x: realm.x + Math.cos(angle) * radius,
        y: realm.y + Math.sin(angle) * radius,
      };
    });
  }, []);

  const visibleStars = useMemo(() => {
    return positions.filter(s => filter === 'ALL' || s.category === filter);
  }, [positions, filter]);

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
      <svg viewBox="0 0 800 650" className="w-full h-full">
        <path d="M 400 150 L 200 500 L 600 500 Z" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
        
        {Object.entries(realms).map(([key, r]) => (
          <g key={key}>
            <circle cx={r.x} cy={r.y} r="180" fill={r.color} fillOpacity="0.02" stroke={r.color} strokeOpacity="0.05" />
            <text x={r.x} y={r.y - 200} textAnchor="middle" fill={r.color} className="text-sm font-bold tracking-widest uppercase opacity-60">
              {r.label}
            </text>
          </g>
        ))}

        {positions.map((star) => (
          filter !== 'ALL' && star.category !== filter && (
            <circle 
              key={`ghost-${star.id}`}
              cx={star.x} cy={star.y} r="3"
              fill="#1e293b" opacity="0.2"
            />
          )
        ))}

        {visibleStars.map((star) => (
          <g 
            key={star.id} 
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            onClick={() => onSelectStar(star)}
            opacity={selectedId && selectedId !== star.id ? 0.4 : 1}
          >
            <circle 
              cx={star.x} 
              cy={star.y} 
              r={selectedId === star.id ? 14 : 8} 
              fill={star.color}
              className={`transition-all ${selectedId === star.id ? 'animate-pulse' : ''}`}
            />
            <text 
              x={star.x} 
              y={star.y + 22} 
              textAnchor="middle" 
              fill="white" 
              className="text-[10px] font-bold"
              style={{ textShadow: '0 0 4px black' }}
            >
              {star.name[lang]}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 max-w-[200px] bg-black/40 p-2 rounded backdrop-blur">
        {lang === 'zh' 
          ? 'RSI 建模：实在界(红)、象征界(蓝)、想象界(绿)。' 
          : 'RSI Modeling: Real (Red), Symbolic (Blue), Imaginary (Green).'}
      </div>
    </div>
  );
};

export default VisualChart;
