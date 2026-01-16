
import React from 'react';
import { ChartPalace, StarMapping, Language, LacanRealm } from '../types';

interface BirthChartProps {
  chart: ChartPalace[];
  lang: Language;
  onSelectStar: (star: StarMapping, palaceId: string) => void;
  selectedStarId: string | null;
}

const BirthChart: React.FC<BirthChartProps> = ({ chart, lang, onSelectStar, selectedStarId }) => {
  const layout = [5, 6, 7, 8, 4, -1, -1, 9, 3, -1, -1, 10, 2, 1, 0, 11];

  const getRealmTag = (realm: LacanRealm) => {
    switch(realm) {
      case LacanRealm.REAL: return 'R';
      case LacanRealm.SYMBOLIC: return 'S';
      case LacanRealm.IMAGINARY: return 'I';
    }
  };

  const getStarClasses = (star: StarMapping, isSelected: boolean) => {
    let base = "flex items-center justify-between w-full text-left text-[10px] px-1.5 py-1 rounded-lg mb-0.5 transition-all truncate border ";
    if (isSelected) return base + "bg-white text-slate-950 font-black border-white shadow-lg z-10 scale-105";
    
    switch(star.realm) {
      case LacanRealm.REAL: return base + "text-rose-400 bg-rose-500/5 border-rose-500/10 hover:border-rose-500/40";
      case LacanRealm.SYMBOLIC: return base + "text-indigo-400 bg-indigo-500/5 border-indigo-500/10 hover:border-indigo-500/40";
      case LacanRealm.IMAGINARY: return base + "text-emerald-400 bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/40";
      default: return base + "text-slate-500 bg-slate-800/10 border-slate-800/20";
    }
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full aspect-square bg-slate-950 border border-slate-800 p-1.5 rounded-[2rem] shadow-2xl print:border-slate-300 print:bg-white print:rounded-none">
      {layout.map((cellIdx, i) => {
        if (cellIdx === -1) {
          if (i === 5) return <div key="center" className="col-span-2 row-span-2 flex flex-col items-center justify-center p-8 bg-slate-900/20 border border-slate-800/30 rounded-[2rem] relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
               <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" /></svg>
             </div>
             <span className="text-slate-700 font-black text-2xl uppercase tracking-[0.4em] opacity-30 italic">Topology</span>
             <span className="text-slate-800 text-[8px] font-bold mt-2 opacity-20">R · S · I Mapping Engine</span>
          </div>;
          return null;
        }

        const palace = chart[cellIdx];
        if (!palace) return <div key={i} className="bg-slate-900/20 rounded-xl" />;

        return (
          <div key={cellIdx} className="border border-slate-800/50 bg-slate-900/30 p-2 flex flex-col justify-between hover:bg-slate-900/60 transition-all rounded-2xl print:border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-1.5 mb-2">
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">{palace.palaceName[lang]}</span>
              <span className="text-[9px] text-slate-700 font-black opacity-60">{palace.branch}</span>
            </div>
            
            <div className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar max-h-[100px] md:max-h-none">
              {palace.stars.map((star) => (
                <button
                  key={star.id}
                  onClick={() => onSelectStar(star, palace.id)}
                  className={getStarClasses(star, selectedStarId === star.id)}
                >
                  <span className="truncate">{star.name[lang]}</span>
                  <span className={`ml-1 text-[7px] px-1 rounded font-black border ${
                    star.realm === LacanRealm.REAL ? 'text-rose-500 border-rose-500/30' :
                    star.realm === LacanRealm.SYMBOLIC ? 'text-indigo-400 border-indigo-400/30' : 'text-emerald-500 border-emerald-500/30'
                  } ${selectedStarId === star.id ? 'bg-slate-950 text-white border-transparent' : ''}`}>
                    {getRealmTag(star.realm)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BirthChart;
