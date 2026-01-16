
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { STAR_DATA, PALACE_DATA, TRANSFORMATION_DATA } from './data';
import { AnalysisState, StarMapping, Language, AnalysisStyle, ChartPalace, Palace, Transformation, StarCategory, LacanRealm } from './types';
import BirthChart from './components/BirthChart';
import VisualChart from './components/VisualChart';
import { generateZwdsChart, BaziInfo } from './services/zwds_engine';
import { getDetailedAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthHour, setBirthHour] = useState(1);
  const [timezone, setTimezone] = useState(8);
  const [chart, setChart] = useState<ChartPalace[]>([]);
  const [bazi, setBazi] = useState<BaziInfo | null>(null);
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

  const handleGenerate = useCallback(() => {
    const { chart: newChart, bazi: newBazi } = generateZwdsChart(birthDate, birthHour, timezone);
    setChart(newChart);
    setBazi(newBazi);
  }, [birthDate, birthHour, timezone]);

  // Initial generation
  useEffect(() => {
    handleGenerate();
  }, []);

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
      setState(prev => ({ ...prev, aiInsight: "Analysis failed. Please check your API configuration.", loading: false }));
    }
  };

  const t = (zh: string, en: string) => (state.language === 'zh' ? zh : en);

  const availableStars = useMemo(() => {
    return STAR_DATA.filter(s => s.category === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl mb-12 flex flex-col xl:flex-row justify-between items-center gap-8">
        <div className="text-center xl:text-left">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-rose-500 bg-clip-text text-transparent italic leading-tight uppercase tracking-tighter">
            Lacanian ZiWei Explorer
          </h1>
          <p className="text-slate-500 text-[10px] tracking-[0.5em] uppercase font-bold mt-1">
            {t('实在 · 象征 · 想象的命理拓扑', 'RSI Topological Mapping')}
          </p>
        </div>

        {/* Input Controls */}
        <div className="relative group">
          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900/40 p-5 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-black uppercase ml-1 tracking-widest">{t('出生日期', 'DATE')}</span>
              <input type="date" value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 ring-indigo-500 text-indigo-100" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-black uppercase ml-1 tracking-widest">{t('时辰', 'HOUR')}</span>
              <select value={birthHour} onChange={(e)=>setBirthHour(parseInt(e.target.value))} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none ring-indigo-500 appearance-none min-w-[110px] text-indigo-100">
                {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map((b, i) => <option key={b} value={i+1}>{b}时 ({(i*2+23)%24}:00-{(i*2+1)%24}:00)</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-black uppercase ml-1 tracking-widest">{t('时区', 'GMT')}</span>
              <select value={timezone} onChange={(e)=>setTimezone(parseInt(e.target.value))} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none ring-indigo-500 appearance-none min-w-[80px] text-indigo-100">
                {Array.from({length: 25}, (_, i) => i - 12).map(v => <option key={v} value={v}>GMT {v >= 0 ? '+' : ''}{v}</option>)}
              </select>
            </div>
            <button onClick={handleGenerate} className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black transition-all shadow-xl shadow-indigo-900/20 active:scale-95 mt-4 xl:mt-0 uppercase tracking-widest">
              {t('生成命盘', 'GENERATE')}
            </button>
          </div>
          <p className="mt-3 text-[10px] text-slate-500 font-medium text-center italic opacity-80">
            {t('* 本网页生成的命盘仅供参考，实际分析请用专业排盘软件', '* Chart for reference only. Use professional software for analysis.')}
          </p>
        </div>
      </header>

      {/* Bazi Display */}
      {bazi && (
        <div className="w-full max-w-7xl flex flex-wrap justify-center gap-6 md:gap-12 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          {Object.entries(bazi).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-[10px] text-slate-600 font-black uppercase mb-1 tracking-widest">
                {t(key === 'year' ? '年柱' : key === 'month' ? '月柱' : key === 'day' ? '日柱' : '时柱', key.toUpperCase())}
              </span>
              <div className="text-3xl font-black bg-slate-900/80 w-20 h-20 flex items-center justify-center rounded-3xl border border-slate-800 shadow-xl text-indigo-400 backdrop-blur-sm group hover:border-indigo-500/50 transition-colors">
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Chart */}
        <div className="lg:col-span-7 space-y-8">
           <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit backdrop-blur-sm">
              <button onClick={() => setViewMode('GRID')} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'}`}>GRID</button>
              <button onClick={() => setViewMode('TOPOLOGY')} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'TOPOLOGY' ? 'bg-rose-600 shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'}`}>TOPOLOGY</button>
            </div>

            <div className="w-full transition-opacity duration-500">
              {viewMode === 'GRID' ? (
                <BirthChart chart={chart} lang={state.language} onSelectStar={handleSelectStar} selectedStarId={state.selectedStar?.id || null} />
              ) : (
                <VisualChart onSelectStar={handleSelectStar} selectedId={state.selectedStar?.id || null} filter="ALL" lang={state.language} />
              )}
            </div>
        </div>

        {/* Right Column: Analysis & Library */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all border-indigo-500/10 hover:border-indigo-500/20">
            {state.selectedStar ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-start border-b border-slate-800/50 pb-8">
                  <div>
                    <h2 className="text-6xl font-black mb-2 flex items-baseline gap-4 tracking-tighter" style={{ color: state.selectedStar.color }}>
                      {state.selectedStar.name[state.language]}
                      <span className="text-[10px] text-slate-600 font-normal italic tracking-normal opacity-60 uppercase">{state.selectedStar.pinyin}</span>
                    </h2>
                    <p className="text-sm text-indigo-400 font-black uppercase tracking-[0.3em] mt-1">{state.selectedStar.lacanConcept[state.language]}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                    state.selectedStar.realm === LacanRealm.REAL ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                    state.selectedStar.realm === LacanRealm.SYMBOLIC ? 'text-indigo-400 border-indigo-400/30 bg-indigo-500/5' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'
                  }`}>
                    {state.selectedStar.realm}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">{t('所在宫位', 'TARGET PALACE')}</label>
                      <select value={state.selectedPalace?.id || ''} onChange={(e) => setState(p => ({...p, selectedPalace: PALACE_DATA.find(pd => pd.id === e.target.value) || null}))} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold focus:ring-1 ring-indigo-500 outline-none transition-all text-indigo-100">
                        <option value="">{t('宫位独立', 'INDEPENDENT')}</option>
                        {PALACE_DATA.map(p => <option key={p.id} value={p.id}>{p.name[state.language]}</option>)}
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">{t('四化联动', 'TRANSFORMATION')}</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {TRANSFORMATION_DATA.map(tr => {
                          const isPossible = state.selectedStar?.canTransform?.[tr.id as keyof typeof state.selectedStar.canTransform];
                          return (
                            <button key={tr.id} disabled={!isPossible} onClick={() => setState(p => ({ ...p, selectedTrans: p.selectedTrans?.id === tr.id ? null : tr }))} className={`py-3 rounded-xl text-[10px] font-black transition-all border ${!isPossible ? 'opacity-5 grayscale pointer-events-none' : state.selectedTrans?.id === tr.id ? 'bg-white text-slate-950 border-white shadow-lg scale-105' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`} style={{ color: isPossible && state.selectedTrans?.id !== tr.id ? tr.color : 'inherit' }}>
                              {tr.name[state.language][1]}
                            </button>
                          );
                        })}
                      </div>
                   </div>
                </div>

                <button onClick={executeAnalysis} disabled={state.loading} className="group w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-900/30">
                  {state.loading ? t('能指织网中...', 'DECODING REALITY...') : t('执行合参解析', 'EXECUTE ANALYSIS')}
                </button>

                {state.aiInsight && (
                  <div className="bg-slate-950/80 p-8 rounded-[2.5rem] border border-indigo-500/20 animate-in zoom-in-95 backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-indigo-100/90 whitespace-pre-wrap font-serif italic selection:bg-indigo-500/30">
                      {state.aiInsight}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-dashed border-indigo-500/50 animate-spin-slow"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                  {t('请先在命盘中选择一个能指', 'SELECT A SIGNIFIER TO DECODE')}
                </p>
              </div>
            )}
          </div>

          {/* Star Library Drawer */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-sm">
            <div className="flex gap-8 mb-6 border-b border-slate-800/60 pb-4 overflow-x-auto no-scrollbar">
              {[StarCategory.MAIN, StarCategory.ASSISTANT, StarCategory.MISC].map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap pb-1 ${activeTab === cat ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}>
                  {cat === StarCategory.MAIN ? t('14主星', 'Main') : cat === StarCategory.ASSISTANT ? t('14助星', 'Assistant') : t('杂曜', 'Misc')}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {availableStars.map(star => (
                <button key={star.id} onClick={() => handleSelectStar(star)} className={`px-2 py-3 rounded-2xl text-[10px] font-bold border transition-all truncate text-center ${state.selectedStar?.id === star.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}>
                  {star.name[state.language]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 text-[9px] text-slate-800 font-bold tracking-[0.6em] uppercase mb-12 flex flex-col items-center gap-4">
        <div className="h-px w-24 bg-slate-900"></div>
        <span>TOPOLOGY ZIWEI // LACANIAN RSI SYSTEM v3.2</span>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
