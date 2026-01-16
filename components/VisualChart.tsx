
import React, { useMemo } from 'react';
import { STAR_DATA } from '../data';
import { LacanRealm, StarMapping } from '../types';

interface VisualChartProps {
  onSelectStar: (star: StarMapping) => void;
  selectedId: string | null;
}

const VisualChart: React.FC<VisualChartProps> = ({ onSelectStar, selectedId }) => {
  const realms = {
    [LacanRealm.REAL]: { x: 400, y: 150, color: '#ef4444', label: '实在界 (The Real)' },
    [LacanRealm.SYMBOLIC]: { x: 200, y: 500, color: '#3b82f6', label: '象征界 (The Symbolic)' },
    [LacanRealm.IMAGINARY]: { x: 600, y: 500, color: '#10b981', label: '想象界 (The Imaginary)' },
  };

  const positions = useMemo(() => {
    const realmCounts: Record<string, number> = {};
    return STAR_DATA.map((star) => {
      const realm = realms[star.realm];
      const count = realmCounts[star.realm] || 0;
      realmCounts[star.realm] = count + 1;
      
      // Calculate offset based on index in realm to spread them out
      const angle = (count * 2 * Math.PI) / 5; // Assuming max 5-6 stars per realm
      const radius = 60 + (count * 10);
      return {
        ...star,
        x: realm.x + Math.cos(angle) * radius,
        y: realm.y + Math.sin(angle) * radius,
      };
    });
  }, []);

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
      <svg viewBox="0 0 800 650" className="w-full h-full">
        {/* Connection Lines (Venn-like structure) */}
        <path d="M 400 150 L 200 500 L 600 500 Z" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Realm Labels */}
        {Object.entries(realms).map(([key, r]) => (
          <g key={key}>
            <circle cx={r.x} cy={r.y} r="140" fill={r.color} fillOpacity="0.03" stroke={r.color} strokeOpacity="0.1" />
            <text x={r.x} y={r.y - 160} textAnchor="middle" fill={r.color} className="text-sm font-bold tracking-widest uppercase">
              {r.label}
            </text>
          </g>
        ))}

        {/* Stars */}
        {positions.map((star) => (
          <g 
            key={star.id} 
            className="cursor-pointer transition-all duration-300 hover:scale-110"
            onClick={() => onSelectStar(star)}
          >
            <circle 
              cx={star.x} 
              cy={star.y} 
              r={selectedId === star.id ? 14 : 10} 
              fill={star.color}
              className={`transition-all ${selectedId === star.id ? 'animate-pulse' : ''}`}
            />
            <text 
              x={star.x} 
              y={star.y + 25} 
              textAnchor="middle" 
              fill="white" 
              className="text-[12px] font-medium"
              style={{ textShadow: '0 0 4px black' }}
            >
              {star.name}
            </text>
            <text 
              x={star.x} 
              y={star.y + 40} 
              textAnchor="middle" 
              fill={star.color} 
              className="text-[10px] opacity-80"
            >
              {star.pinyin}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 text-xs text-slate-500 max-w-xs bg-black/40 p-2 rounded">
        基于拉康的三界模型 (RSI) 分类：实在界 (Real)、象征界 (Symbolic)、想象界 (Imaginary)。
      </div>
    </div>
  );
};

export default VisualChart;
