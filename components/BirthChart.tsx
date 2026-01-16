
import React from 'react';
import { ChartPalace, Language, StarMapping } from '../types';

interface BirthChartProps {
  chart: ChartPalace[];
  lang: Language;
  onSelectStar: (star: StarMapping) => void;
  selectedStarId: string | null;
}

const BirthChart: React.FC<BirthChartProps> = ({ chart, lang, onSelectStar, selectedStarId }) => {
  const layout = [
    5, 6, 7, 8,
    4, -1, -1, 9,
    3, -1, -1, 10,
    2, 1, 0, 11
  ];

  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
  const meta = (chart as any).meta || {};
  const bazi = meta.bazi || {};

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-1 aspect-square w-full max-w-4xl mx-auto bg-slate-900 border-2 border-slate-800 p-1 rounded-lg">
      {layout.map((cellIdx, i) => {
        if (cellIdx === -1) {
          if (i === 5) {
            return (
              <div key="center" className="col-span-2 row-span-2 flex flex-col items-center justify-center text-center p-2 bg-slate-950/80 rounded border border-slate-800/50 shadow-inner">
                <div className="flex gap-4 mb-3">
                  {[
                    { label: t('年', 'Year'), val: bazi.year },
                    { label: t('月', 'Month'), val: bazi.month },
                    { label: t('日', 'Day'), val: bazi.day },
                    { label: t('时', 'Hour'), val: bazi.hour },
                  ].map((p, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-[8px] text-slate-500 font-bold mb-1">{p.label}</span>
                      <div className="text-sm font-black text-indigo-400 leading-none tracking-tighter w-6 flex flex-col">
                        <span>{p.val?.[0]}</span>
                        <span>{p.val?.[1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-indigo-200 font-bold mb-3 tracking-widest border-b border-indigo-500/20 pb-1">
                  {meta.lunar}
                </div>
                <div className="px-3 py-1 bg-indigo-600/20 rounded-full text-[10px] text-indigo-300 font-bold border border-indigo-500/30 mb-2">
                  {meta.phase} · {t('拉康拓扑', 'Lacanian Topology')}
                </div>
                <div className="text-[9px] text-slate-600 italic px-2 leading-tight">
                   {t('“真理作为缺失在言说中显现”', '"Truth emerges as a lack in speech"')}
                </div>
              </div>
            );
          }
          return null;
        }

        const palace = chart[cellIdx];
        const isBody = palace.transformations.includes('身宫');

        return (
          <div 
            key={cellIdx} 
            className="border border-slate-800 bg-slate-950/40 p-2 flex flex-col justify-between overflow-hidden hover:bg-slate-800/30 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-1 border-b border-slate-800/50 pb-1">
              <span className="text-[11px] font-bold text-indigo-300 group-hover:text-white transition-colors">
                {palace.palaceName[lang]}
                {isBody && <span className="ml-1 text-rose-500 text-[8px] font-black">{t('(身)', '(B)')}</span>}
              </span>
              <span className="text-[8px] text-slate-700 font-mono tracking-tighter">{palace.branch}</span>
            </div>
            
            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pt-1">
              {palace.stars.map((star, sIdx) => {
                const trans = (star as any).currentTransformation;
                return (
                  <button
                    key={`${star.id}-${sIdx}`}
                    onClick={() => onSelectStar(star)}
                    className={`flex items-center justify-between text-[10px] px-1 py-0.5 rounded transition-all truncate border border-transparent ${
                      selectedStarId === star.id 
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    style={{ color: selectedStarId === star.id ? '' : star.color }}
                  >
                    <span>{star.name[lang]}</span>
                    {trans && (
                      <span 
                        className="ml-1 text-[7px] font-black px-0.5 rounded leading-none"
                        style={{ backgroundColor: trans.color, color: '#000' }}
                      >
                        {trans.name[lang].slice(-1)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BirthChart;
