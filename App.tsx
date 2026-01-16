
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { STAR_DATA, PALACE_DATA, TRANSFORMATION_DATA } from './data';
import { AnalysisState, StarMapping, Language, AnalysisStyle, ChartPalace, Palace, Transformation, StarCategory, LacanRealm } from './types';
import BirthChart from './components/BirthChart';
import VisualChart from './components/VisualChart';
import { generateZwdsChart } from './services/zwds_engine';
import { getDetailedAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthHour, setBirthHour] = useState(1);
  const [chart, setChart] = useState<ChartPalace[]>([]);
  const [viewMode, setViewMode] = useState<'GRID' | 'TOPOLOGY'>('GRID');
  
  const [state, setState] = useState<AnalysisState>({
    selectedStar: null,
    selectedPalace: null,
    selectedTrans: null,
    style: 'Lacanian',
    loading: false,
    aiInsight: null,
    language: 'zh'
  });

  const [activeTab, setActiveTab] = useState<StarCategory>(StarCategory.MAIN);

  useEffect(() => {
    const newChart = generateZwdsChart(birthDate, birthHour);
    setChart(newChart);
  }, [birthDate, birthHour]);

  const handleSelectStar = useCallback((star: StarMapping, palaceId?: string) => {
    const palace = palaceId ? PALACE_DATA.find(p => p.id === palaceId) : state.selectedPalace;
    setState(prev => ({ 
      ...prev, 
      selectedStar: star, 
      selectedPalace: palace || prev.selectedPalace,
      selectedTrans: null,
      aiInsight: null 
    }));
  }, [state.selectedPalace]);

  const executeAnalysis = async () => {
    if (!state.selectedStar) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      const insight = await getDetailedAnalysis(
        state.selectedStar, 
        state.selectedPalace, 
        state.selectedTrans, 
        state.language, 
        state.style
      );
      setState(prev => ({ ...prev, aiInsight: insight, loading: false }));
    } catch {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const t = (zh: string, en: string) => (state.language === 'zh' ? zh : en);

  const availableStars = useMemo(() => {
    return STAR_DATA.filter(s => s.category === activeTab);
  }, [activeTab]);

  const getRealmColor = (realm: LacanRealm) => {
    switch(realm) {
      case LacanRealm.REAL: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case LacanRealm.SYMBOLIC: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case LacanRealm.IMAGINARY: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-rose-500 bg-clip-text text-transparent italic">RSI TOPOLOGY & ZWDS</h1>
          <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase font-bold">{t('实在 · 象征 · 想象的命理映射', 'Lacanian Mapping of Fate')}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-xl">
          <input type="date" value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} className="bg-transparent text-sm p-1 focus:outline-none border-b border-slate-700" />
          <button onClick={() => window.print()} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-xs font-black transition-all shadow-lg shadow-indigo-500/30 active:scale-95">
            {t('导出 PDF 报告', 'EXPORT PDF')}
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Charts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setViewMode('GRID')}
                className={`px-5 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t('标准命盘', 'GRID')}
              </button>
              <button 
                onClick={() => setViewMode('TOPOLOGY')}
                className={`px-5 py-1.5 rounded-lg text-xs font-black transition-all ${viewMode === 'TOPOLOGY' ? 'bg-rose-600 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t('拉康拓扑', 'TOPOLOGY')}
              </button>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span><span className="text-[10px] text-slate-500 uppercase font-bold">Real</span>
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span><span className="text-[10px] text-slate-500 uppercase font-bold">Symbolic</span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-[10px] text-slate-500 uppercase font-bold">Imaginary</span>
            </div>
          </div>

          <div className="print:w-full">
            {viewMode === 'GRID' ? (
              <BirthChart 
                chart={chart} 
                lang={state.language} 
                onSelectStar={handleSelectStar}
                selectedStarId={state.selectedStar?.id || null}
              />
            ) : (
              <VisualChart 
                onSelectStar={handleSelectStar}
                selectedId={state.selectedStar?.id || null}
                filter="ALL"
                lang={state.language}
              />
            )}
          </div>
        </div>

        {/* Right Section: Controls & Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-slate-200">
            {/* RSI Indicator Background */}
            {state.selectedStar && (
               <div className={`absolute top-0 right-0 px-8 py-2 text-[10px] font-black uppercase tracking-widest ${getRealmColor(state.selectedStar.realm)} border-b border-l rounded-bl-3xl`}>
                 {state.selectedStar.realm} REALM
               </div>
            )}

            <div className="flex gap-2 mb-8 print:hidden">
              {['Lacanian', 'Classic', 'Semiotics', 'Pictographic'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setState(p => ({ ...p, style: s as AnalysisStyle }))}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-black border transition-all ${state.style === s ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {state.selectedStar ? (
              <div className="space-y-8">
                <div className="border-b border-slate-800/50 pb-6">
                  <h2 className="text-5xl font-black mb-2 flex items-baseline gap-3" style={{ color: state.selectedStar.color }}>
                    {state.selectedStar.name[state.language]}
                    <span className="text-xs text-slate-500 font-normal italic tracking-normal">{state.selectedStar.pinyin}</span>
                  </h2>
                  <p className="text-sm text-indigo-400 font-black uppercase tracking-[0.2em]">{state.selectedStar.lacanConcept[state.language]}</p>
                </div>

                {/* Star-Palace-Trans Selectors */}
                <div className="grid grid-cols-2 gap-6 print:hidden">
                   <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">{t('宫位选择', 'Select Palace')}</label>
                      <select 
                        value={state.selectedPalace?.id || ''} 
                        onChange={(e) => setState(p => ({...p, selectedPalace: PALACE_DATA.find(pd => pd.id === e.target.value) || null}))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-bold focus:ring-2 ring-indigo-500/50 outline-none transition-all"
                      >
                        <option value="">{t('独立分析', 'Independent')}</option>
                        {PALACE_DATA.map(p => <option key={p.id} value={p.id}>{p.name[state.language]}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">{t('宫位拓扑内涵', 'Palace RSI')}</label>
                      <div className="text-[11px] text-indigo-300 p-3 bg-indigo-950/20 rounded-2xl border border-indigo-500/20 font-bold min-h-[42px] flex items-center">
                        {state.selectedPalace ? t(state.selectedPalace.concept.zh, state.selectedPalace.concept.en) : '-'}
                      </div>
                   </div>
                </div>

                <div className="space-y-4 print:hidden">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('四化联动', 'Transformation')}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {TRANSFORMATION_DATA.map(tr => {
                      const isPossible = state.selectedStar?.canTransform?.[tr.id as keyof typeof state.selectedStar.canTransform];
                      return (
                        <button
                          key={tr.id}
                          disabled={!isPossible}
                          onClick={() => setState(p => ({ ...p, selectedTrans: p.selectedTrans?.id === tr.id ? null : tr }))}
                          className={`group py-3 rounded-2xl text-xs font-black transition-all border flex flex-col items-center gap-1
                            ${!isPossible ? 'opacity-5 cursor-not-allowed bg-slate-950 border-transparent grayscale select-none pointer-events-none' : 
                              state.selectedTrans?.id === tr.id ? 'bg-white border-white text-slate-950 shadow-xl scale-105' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}
                          `}
                        >
                          <span style={{ color: !isPossible ? 'gray' : (state.selectedTrans?.id === tr.id ? 'black' : tr.color) }}>{tr.name[state.language]}</span>
                          {isPossible && <span className="text-[7px] opacity-40 group-hover:opacity-100">{tr.concept[state.language]}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={executeAnalysis}
                  disabled={state.loading}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-3xl font-black text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-900/40 print:hidden"
                >
                  {state.loading ? t('分析中...', 'ANALYZING...') : t('执行合参解析', 'EXECUTE ANALYSIS')}
                </button>

                {state.aiInsight && (
                  <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-indigo-500/30 animate-in fade-in zoom-in-95 print:bg-white print:text-black print:p-4">
                    <h3 className="text-[10px] font-black text-indigo-500 mb-6 border-b border-indigo-900/30 pb-2 uppercase tracking-widest">{t('分析报告', 'Report')}</h3>
                    <div className="text-sm leading-[1.8] text-indigo-100/90 whitespace-pre-wrap font-serif italic selection:bg-indigo-500 selection:text-white">
                      {state.aiInsight}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 animate-spin-slow"></div>
                <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">{t('请先选择星曜', 'Select a Star to Start')}</p>
              </div>
            )}
          </div>

          {/* Assistant & Misc Stars Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 print:hidden">
            <div className="flex gap-6 mb-6 border-b border-slate-800/50 pb-3 overflow-x-auto no-scrollbar">
              {[StarCategory.MAIN, StarCategory.ASSISTANT, StarCategory.MISC].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveTab(cat)}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === cat ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {cat === StarCategory.MAIN ? t('14主星', 'Main 14') : cat === StarCategory.ASSISTANT ? t('14助星', 'Assistant 14') : t('三十七杂曜', 'Misc 37')}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
              {availableStars.map(star => (
                <button 
                  key={star.id} 
                  onClick={() => handleSelectStar(star)}
                  className={`px-2 py-2.5 rounded-xl text-[10px] font-bold transition-all border text-center leading-tight truncate ${state.selectedStar?.id === star.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                >
                  {star.name[state.language]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-[10px] text-slate-600 font-bold tracking-widest uppercase mb-12 print:hidden">
        Topology ZiWei Engine © 2025 // RSI FRAMEWORK
      </footer>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @media print {
          body { background: white !important; color: black !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          main { display: block !important; }
          .lg\\:col-span-7, .lg\\:col-span-5 { width: 100% !important; margin-bottom: 2rem; border: none !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
