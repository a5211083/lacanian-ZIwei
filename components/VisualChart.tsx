
import React, { useMemo, useState } from 'react';
import { STAR_DATA } from '../data';
import { LacanRealm, StarMapping, StarCategory, Language } from '../types';

interface VisualChartProps {
  onSelectStar: (star: StarMapping) => void;
  selectedId: string | null;
  filter: StarCategory | 'ALL';
  lang: Language;
}

const VisualChart: React.FC<VisualChartProps> = ({ onSelectStar, selectedId, filter, lang }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);

  // 拓扑界域中心坐标
  const realms = {
    [LacanRealm.REAL]: { x: 400, y: 220, color: '#f43f5e', label: lang === 'zh' ? '实在界' : 'Real' },
    [LacanRealm.SYMBOLIC]: { x: 280, y: 440, color: '#3b82f6', label: lang === 'zh' ? '象征界' : 'Symbolic' },
    [LacanRealm.IMAGINARY]: { x: 520, y: 440, color: '#10b981', label: lang === 'zh' ? '想象界' : 'Imaginary' },
  };

  // 尺寸权重映射
  const getStarSize = (category: StarCategory, isSelected: boolean) => {
    let base = 6;
    if (category === StarCategory.MAIN) base = 12;
    if (category === StarCategory.ASSISTANT) base = 8;
    return isSelected ? base * 1.5 : base;
  };

  // 智能分层布局计算
  const positionedStars = useMemo(() => {
    const realmGroups: Record<string, StarMapping[]> = {
      [LacanRealm.REAL]: [],
      [LacanRealm.SYMBOLIC]: [],
      [LacanRealm.IMAGINARY]: [],
    };

    // 分类
    STAR_DATA.forEach(star => {
      if (filter === 'ALL' || star.category === filter) {
        realmGroups[star.realm].push(star);
      }
    });

    return Object.entries(realmGroups).flatMap(([realmKey, stars]) => {
      const center = realms[realmKey as LacanRealm];
      
      // 按重要程度排序，主星在内圈
      const sortedStars = [...stars].sort((a, b) => {
        const order = { [StarCategory.MAIN]: 0, [StarCategory.ASSISTANT]: 1, [StarCategory.MISC]: 2 };
        return order[a.category] - order[b.category];
      });

      return sortedStars.map((star, index) => {
        // 分层逻辑：0-5颗内圈，6-15颗中圈，16+外圈
        let radius = 0;
        let angleOffset = 0;
        
        if (index < 5) {
          radius = 45;
          angleOffset = (index / 5) * 2 * Math.PI;
        } else if (index < 15) {
          radius = 85;
          angleOffset = ((index - 5) / 10) * 2 * Math.PI + 0.3;
        } else {
          radius = 125;
          angleOffset = ((index - 15) / (sortedStars.length - 15)) * 2 * Math.PI + 0.6;
        }

        // 实在界特殊偏移，避免视觉堆叠
        const finalAngle = angleOffset - Math.PI / 2;

        return {
          ...star,
          x: center.x + Math.cos(finalAngle) * radius,
          y: center.y + Math.sin(finalAngle) * radius,
          radius: getStarSize(star.category, selectedId === star.id)
        };
      });
    });
  }, [filter, selectedId, lang]);

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-slate-950/80 rounded-[3rem] overflow-hidden border border-slate-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl group">
      <svg viewBox="0 0 800 650" className="w-full h-full select-none">
        <defs>
          <radialGradient id="realGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="symbolicGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="imaginaryGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <filter id="neoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 拓扑背景：博罗米结（三环交汇区域） */}
        <g opacity="0.4">
          <circle cx={realms[LacanRealm.REAL].x} cy={realms[LacanRealm.REAL].y} r="180" fill="url(#realGrad)" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="5,5" />
          <circle cx={realms[LacanRealm.SYMBOLIC].x} cy={realms[LacanRealm.SYMBOLIC].y} r="180" fill="url(#symbolicGrad)" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="5,5" />
          <circle cx={realms[LacanRealm.IMAGINARY].x} cy={realms[LacanRealm.IMAGINARY].y} r="180" fill="url(#imaginaryGrad)" stroke="#10b981" strokeWidth="0.5" strokeDasharray="5,5" />
        </g>

        {/* 界域标签 */}
        {Object.values(realms).map((r, i) => (
          <text key={i} x={r.x} y={r.y + (i === 0 ? -200 : 210)} textAnchor="middle" className="text-[12px] font-black tracking-[0.5em] uppercase fill-slate-700">
            {r.label}
          </text>
        ))}

        {/* 连线：仅在选中时显示能指到各界域的张力线 */}
        {selectedId && (
          <g className="animate-in fade-in duration-700">
            {(() => {
              const s = positionedStars.find(p => p.id === selectedId);
              if (!s) return null;
              return Object.values(realms).map((r, idx) => (
                <line key={idx} x1={s.x} y1={s.y} x2={r.x} y2={r.y} stroke={s.color} strokeWidth="0.5" strokeDasharray="8,8" opacity="0.2" />
              ));
            })()}
          </g>
        )}

        {/* 星曜能指群 */}
        {positionedStars.map((star) => {
          const isSelected = selectedId === star.id;
          const isHovered = hoveredId === star.id;
          const isMain = star.category === StarCategory.MAIN;
          const showLabel = isSelected || isHovered || (isMain && !selectedId);

          return (
            <g 
              key={star.id} 
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredId(star.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectStar(star)}
              style={{ opacity: selectedId && !isSelected ? 0.15 : 1 }}
            >
              {/* 光晕层 */}
              {(isSelected || isHovered) && (
                <circle cx={star.x} cy={star.y} r={star.radius + 10} fill={star.color} opacity="0.15" className="animate-pulse" />
              )}
              
              {/* 核心点 */}
              <circle 
                cx={star.x} 
                cy={star.y} 
                r={star.radius} 
                fill={isSelected ? 'white' : star.color}
                className="transition-all duration-500"
                filter={isSelected || isMain ? 'url(#neoGlow)' : ''}
                stroke={isSelected ? star.color : 'none'}
                strokeWidth="2"
              />

              {/* 标签文本：动态显示以减少噪音 */}
              {showLabel && (
                <g className="animate-in fade-in zoom-in-95 duration-200">
                  <rect 
                    x={star.x - 20} y={star.y + 12} width="40" height="14" rx="4" 
                    fill="#020617" opacity="0.8" 
                  />
                  <text 
                    x={star.x} y={star.y + 22} 
                    textAnchor="middle" 
                    fill={isSelected ? 'white' : star.color} 
                    className={`text-[9px] font-black tracking-tighter`}
                  >
                    {star.name[lang]}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* 底部说明 */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
        <div className="flex gap-6">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-400"></div>
             <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{t('杂曜', 'MISC')}</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{t('助星', 'ASSISTANT')}</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 rounded-full bg-white border border-indigo-500"></div>
             <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{t('14主星', 'MAIN STARS')}</span>
           </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{t('偶然性拓扑', 'CONTINGENCY TOPOLOGY')}</div>
          <div className="text-[8px] text-slate-800 italic uppercase mt-1">{t('欲望的轨迹在三界中交织', 'DESIRE TRAJECTORIES INTERWEAVED IN RSI')}</div>
        </div>
      </div>
    </div>
  );
};

export default VisualChart;
