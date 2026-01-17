
import React, { useState } from 'react';
import { ChartPalace, StarMapping, Language, LacanRealm } from '../types';

interface BirthChartProps {
  chart: ChartPalace[];
  lang: Language;
  onSelectStar: (star: StarMapping, palaceId: string) => void;
  selectedStarId: string | null;
}

const BirthChart: React.FC<BirthChartProps> = ({ chart, lang, onSelectStar, selectedStarId }) => {
  const [activePalaceId, setActivePalaceId] = useState<string | null>(null);
  const layout = [5, 6, 7, 8, 4, -1, -1, 9, 3, -1, -1, 10, 2, 1, 0, 11];

  const getRealmTag = (realm: LacanRealm) => {
    switch(realm) {
      case LacanRealm.REAL: return 'R';
      case LacanRealm.SYMBOLIC: return 'S';
      case LacanRealm.IMAGINARY: return 'I';
    }
  };

  const getStarColorClass = (realm: LacanRealm) => {
    switch(realm) {
      case LacanRealm.REAL: return "text-rose-400";
      case LacanRealm.SYMBOLIC: return "text-indigo-400";
      case LacanRealm.IMAGINARY: return "text-emerald-400";
      default: return "text-slate-400";
    }
  };

  const getCenterPalace = () => {
    if (!activePalaceId) return null;
    return chart.find(p => p.id === activePalaceId);
  };

  const selectedPalace = getCenterPalace();

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full aspect-square bg-slate-950 border border-slate-800 p-1.5 rounded-[2rem] shadow-2xl print:border-slate-300 print:bg-white print:rounded-none">
      {layout.map((cellIdx, i) => {
        // 渲染中心区域
        if (cellIdx === -1) {
          if (i === 5) return (
            <div key="center" className="col-span-2 row-span-2 flex flex-col items-center justify-center p-4 bg-slate-900/40 border border-slate-800/50 rounded-[2rem] relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" />
                </svg>
              </div>
              
              {selectedPalace ? (
                <div className="w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 px-2">
                    {selectedPalace.stars.length > 0 ? (
                      selectedPalace.stars.map(star => (
                        <button
                          key={star.id}
                          onClick={() => onSelectStar(star, selectedPalace.id)}
                          className={`flex items-center justify-between w-full px-4 py-2 rounded-xl transition-all border group ${
                            selectedStarId === star.id 
                            ? 'bg-white text-slate-950 border-white shadow-xl scale-105' 
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-600 text-slate-200'
                          }`}
                        >
                          <span className={`font-bold text-xs ${selectedStarId === star.id ? 'text-slate-950' : getStarColorClass(star.realm)}`}>
                            {star.name[lang]}
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black border ${
                            star.realm === LacanRealm.REAL ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                            star.realm === LacanRealm.SYMBOLIC ? 'text-indigo-400 border-indigo-400/30 bg-indigo-500/5' : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                          } ${selectedStarId === star.id ? 'bg-slate-950 text-white border-transparent' : ''}`}>
                            {getRealmTag(star.realm)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center opacity-20 text-[10px] uppercase font-bold text-slate-500">
                        {lang === 'zh' ? '空宫' : 'Empty Palace'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center flex flex-col items-center">
                  <span className="text-slate-700 font-black text-2xl uppercase tracking-[0.4em] opacity-30 italic">Topology</span>
                  <span className="text-slate-800 text-[8px] font-bold mt-2 opacity-20">R · S · I Mapping Engine</span>
                  <p className="text-[8px] text-slate-600 mt-4 opacity-30 uppercase tracking-widest">{lang === 'zh' ? '点击宫位以展开星曜' : 'Select a palace to expand stars'}</p>
                </div>
              )}
            </div>
          );
          return null;
        }

        const palace = chart[cellIdx];
        if (!palace) return <div key={i} className="bg-slate-900/20 rounded-xl" />;

        const isActive = activePalaceId === palace.id;

        return (
          <div 
            key={cellIdx} 
            onClick={() => setActivePalaceId(palace.id)}
            className={`cursor-pointer border p-2 flex flex-col justify-between transition-all rounded-2xl group ${
              isActive 
              ? 'border-indigo-500/50 bg-slate-900/80 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]' 
              : 'border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center border-b border-slate-800/30 pb-1.5 mb-2">
              <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-300'}`}>
                {palace.palaceName[lang]}
              </span>
              <span className="text-[9px] text-slate-700 font-black opacity-60">{palace.branch}</span>
            </div>
            
            <div className="flex-1 flex flex-wrap gap-x-2 gap-y-1 content-start overflow-hidden">
              {palace.stars.map((star) => (
                <span
                  key={star.id}
                  className={`text-[10px] font-bold whitespace-nowrap ${getStarColorClass(star.realm)} ${selectedStarId === star.id ? 'underline underline-offset-4 decoration-2' : 'opacity-80'}`}
                >
                  {star.name[lang]}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BirthChart;
