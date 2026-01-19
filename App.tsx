
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { STAR_DATA, PALACE_DATA, TRANSFORMATION_DATA } from './data';
import { AnalysisState, StarMapping, Language, AnalysisStyle, ChartPalace, Palace, Transformation, StarCategory, LacanRealm } from './types';
import BirthChart from './components/BirthChart';
import VisualChart from './components/VisualChart';
import { generateZwdsChart } from './services/zwds_engine';
import { getDetailedAnalysis } from './services/gemini';

const STYLE_OPTIONS: { id: AnalysisStyle; label: { zh: string; en: string } }[] = [
  { id: 'Lacanian', label: { zh: '拉康拓扑', en: 'Lacanian' } },
  { id: 'Classic', label: { zh: '经典命理', en: 'Classic' } },
  { id: 'Semiotics', label: { zh: '符号解构', en: 'Semiotics' } },
  { id: 'Pictographic', label: { zh: '象形原型', en: 'Pictogram' } },
];

const App: React.FC = () => {
  const [chart, setChart] = useState<ChartPalace[]>([]);
  // 默认显示 TOPOLOGY 拓扑视图
  const [viewMode, setViewMode] = useState<'GRID' | 'TOPOLOGY'>('TOPOLOGY');
  const [isCopied, setIsCopied] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [isStarSelectorOpen, setIsStarSelectorOpen] = useState(false);
  
  const [state, setState] = useState<AnalysisState>({
    selectedStar: null,
    selectedPalace: null,
    selectedTrans: null,
    style: 'Lacanian',
    loading: false,
    aiInsight: null,
    language: 'zh'
  });

  const [activeTab, setActiveTab] = useState<StarCategory>(StarCategory.GRADE_A);
  const selectorRef = useRef<HTMLDivElement>(null);

  const formatInsight = (text: string | null) => {
    if (!text) return '';
    return text.replace(/[\s\S]*?<\/think>/g, '').trim();
  };

  const generateRandomChart = useCallback(() => {
    const year = Math.floor(Math.random() * (2010 - 1970 + 1)) + 1970;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 12) + 1;
    
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const { chart: newChart } = generateZwdsChart(dateStr, hour, 8);
    
    setChart(newChart);
    setState(prev => ({
      ...prev,
      selectedStar: null,
      selectedPalace: null,
      selectedTrans: null,
      aiInsight: null
    }));
  }, []);

  useEffect(() => {
    generateRandomChart();
  }, [generateRandomChart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsStarSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    setIsStarSelectorOpen(false);
    // 选中星曜后，自动切换到命盘视图以查看具体的宫位分布
    setViewMode('GRID');
  }, [state.selectedPalace]);

  const executeAnalysis = async () => {
    if (!state.selectedStar) return;
    setState(prev => ({ ...prev, loading: true, aiInsight: "" }));
    try {
      const insight = await getDetailedAnalysis(
        state.selectedStar, 
        state.selectedPalace, 
        state.selectedTrans, 
        state.language, 
        state.style,
        (text) => {
          setState(prev => ({ ...prev, aiInsight: text }));
        }
      );
      setState(prev => ({ ...prev, aiInsight: insight, loading: false }));
    } catch {
      setState(prev => ({ ...prev, aiInsight: "Analysis failed. Please check your API configuration.", loading: false }));
    }
  };

  const handleCopy = useCallback(async () => {
    if (!state.aiInsight) return;
    const cleanText = formatInsight(state.aiInsight);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(cleanText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [state.aiInsight]);

  const t = (zh: string, en: string) => (state.language === 'zh' ? zh : en);

  const availableStars = useMemo(() => {
    return STAR_DATA.filter(s => s.category === activeTab);
  }, [activeTab]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center selection:bg-indigo-500/30 pb-48">
      {/* 顶部工具栏 */}
      <div className="fixed top-6 right-6 z-[110] flex flex-col items-end gap-2">
        <button 
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className={`px-4 py-2 rounded-xl border flex items-center gap-3 transition-all backdrop-blur-md ${showStyleMenu ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'}`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {t('分析视角', 'Lens')}: {STYLE_OPTIONS.find(o => o.id === state.style)?.label[state.language]}
          </span>
          <svg className={`w-3 h-3 transition-transform ${showStyleMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showStyleMenu && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200 w-48 overflow-hidden">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setState(prev => ({ ...prev, style: opt.id, aiInsight: null }));
                  setShowStyleMenu(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${state.style === opt.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'}`}
              >
                {opt.label[state.language]}
              </button>
            ))}
          </div>
        )}
      </div>

      <header className="w-full max-w-7xl mb-12 flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-indigo-300 via-purple-400 to-rose-400 bg-clip-text text-transparent italic leading-tight uppercase tracking-tighter">
          Lacanian ZiWei
        </h1>
        <p className="text-slate-500 text-[10px] tracking-[0.8em] uppercase font-bold opacity-60">
          {t('实在 · 象征 · 想象的命理拓扑', 'RSI Topological Mapping System')}
        </p>
        <button 
          onClick={generateRandomChart} 
          className="group relative px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-xs font-black transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 uppercase tracking-[0.4em] overflow-hidden"
        >
          <span className="relative z-10">{t('重绘命运能指', 'REDRAW SIGNIFIERS')}</span>
        </button>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
            <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/50 w-fit backdrop-blur-md mb-4">
              <button onClick={() => setViewMode('GRID')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-600 hover:text-slate-300'}`}>GRID</button>
              <button onClick={() => setViewMode('TOPOLOGY')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'TOPOLOGY' ? 'bg-rose-600 shadow-lg text-white' : 'text-slate-600 hover:text-slate-300'}`}>TOPOLOGY</button>
            </div>

            <div className="w-full">
              {viewMode === 'GRID' ? (
                <BirthChart chart={chart} lang={state.language} onSelectStar={handleSelectStar} selectedStarId={state.selectedStar?.id || null} />
              ) : (
                <VisualChart onSelectStar={handleSelectStar} selectedId={state.selectedStar?.id || null} filter={activeTab} lang={state.language} />
              )}
            </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all h-full min-h-[500px]">
            {state.selectedStar ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex justify-between items-start border-b border-slate-800/30 pb-10">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-black mb-2 flex items-baseline gap-4 tracking-tighter" style={{ color: state.selectedStar.color }}>
                      {state.selectedStar.name[state.language]}
                    </h2>
                    <p className="text-xs text-indigo-400 font-black uppercase tracking-[0.4em] mt-2">
                      {state.style === 'Lacanian' ? state.selectedStar.lacanConcept[state.language] : t('当前视角解析中', 'Contextual Analysis')}
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${
                    state.selectedStar.realm === LacanRealm.REAL ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                    state.selectedStar.realm === LacanRealm.SYMBOLIC ? 'text-indigo-400 border-indigo-400/30 bg-indigo-400/5' : 'text-emerald-400 border-emerald-500/30 bg-emerald-400/5'
                  }`}>
                    {state.selectedStar.realm}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] text-slate-600 uppercase font-black tracking-widest ml-1">{t('所在宫位', 'PALACE')}</label>
                      <select value={state.selectedPalace?.id || ''} onChange={(e) => setState(p => ({...p, selectedPalace: PALACE_DATA.find(pd => pd.id === e.target.value) || null}))} className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-bold focus:ring-1 ring-indigo-500 outline-none text-indigo-100 appearance-none cursor-pointer">
                        <option value="">{t('宫位独立解析', 'INDEPENDENT')}</option>
                        {PALACE_DATA.map(p => <option key={p.id} value={p.id}>{p.name[state.language]}</option>)}
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] text-slate-600 uppercase font-black tracking-widest ml-1">{t('四化能指', 'TRANSFORM')}</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {TRANSFORMATION_DATA.map(tr => (
                          <button 
                            key={tr.id} 
                            onClick={() => setState(p => ({ ...p, selectedTrans: p.selectedTrans?.id === tr.id ? null : tr }))} 
                            className={`py-3 rounded-xl text-[10px] font-black transition-all border ${state.selectedTrans?.id === tr.id ? 'bg-white text-slate-950 border-white' : 'bg-slate-950/50 border-slate-800'}`} 
                            style={{ color: state.selectedTrans?.id !== tr.id ? tr.color : 'inherit' }}
                          >
                            {tr.name[state.language][1]}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <button onClick={executeAnalysis} disabled={state.loading} className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-[2.5rem] font-black text-[11px] tracking-[0.5em] uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl">
                  {state.loading ? t('结构解码中...', 'DECODING...') : t('执行深度解析', 'EXECUTE ANALYSIS')}
                </button>

                {state.aiInsight !== null && (
                  <div className="bg-slate-950/60 p-8 rounded-[3rem] border border-indigo-500/10 backdrop-blur-md relative">
                    <button onClick={handleCopy} className="absolute top-4 right-4 text-[9px] font-bold text-slate-500 hover:text-white transition-colors">{isCopied ? t('已复制', 'COPIED') : t('复制', 'COPY')}</button>
                    <p className="text-sm leading-relaxed text-slate-300 font-serif italic whitespace-pre-wrap">
                      {formatInsight(state.aiInsight)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-8">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/40 animate-spin-slow"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                  {t('点击命盘中的星曜\n开始解码之旅', 'SELECT A STAR TO BEGIN')}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 底部固定导航栏 - 移至最外层确保始终可见 */}
      <nav className="fixed inset-x-0 bottom-0 z-[200] pb-[env(safe-area-inset-bottom)]">
        {/* 星曜选择器面板 - 向上弹出 */}
        {isStarSelectorOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[95vw] max-w-2xl mb-4 animate-in slide-in-from-bottom-8 fade-in duration-300">
            <div 
              ref={selectorRef}
              className="bg-slate-900/98 border border-slate-800 rounded-[3rem] shadow-[0_-30px_60px_rgba(0,0,0,0.8)] p-8 backdrop-blur-3xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 px-4">
                <div className="flex flex-col">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400">
                    {t('能指选取', 'SIGNIFIER SELECT')}
                  </h3>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                    Grade {activeTab.split('_')[1]} Stars
                  </span>
                </div>
                <button 
                  onClick={() => setIsStarSelectorOpen(false)} 
                  className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[45vh] overflow-y-auto custom-scrollbar pr-2 pb-4">
                {availableStars.map(star => (
                  <button 
                    key={star.id} 
                    onClick={() => handleSelectStar(star)} 
                    className={`px-2 py-4 rounded-2xl text-[11px] font-bold border transition-all duration-300 truncate text-center flex flex-col items-center gap-1 ${
                      state.selectedStar?.id === star.id 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105' 
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {star.name[state.language]}
                  </button>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900 pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* 导航栏主体 */}
        <div className="h-28 bg-slate-900/95 backdrop-blur-3xl border-t border-slate-800/50 flex justify-center items-center shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="max-w-xl w-full flex justify-around items-center px-4">
            {[
              { id: StarCategory.GRADE_A, label: '甲' },
              { id: StarCategory.GRADE_B, label: '乙' },
              { id: StarCategory.GRADE_C, label: '丙' },
              { id: StarCategory.GRADE_D, label: '丁' },
              { id: StarCategory.GRADE_E, label: '戊' }
            ].map((grade) => (
              <button
                key={grade.id}
                onClick={() => {
                  if (activeTab === grade.id && isStarSelectorOpen) {
                    setIsStarSelectorOpen(false);
                  } else {
                    setActiveTab(grade.id);
                    setIsStarSelectorOpen(true);
                  }
                }}
                className={`flex flex-col items-center gap-2 group transition-all duration-300 ${activeTab === grade.id ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-2 transition-all duration-500 ${
                  activeTab === grade.id 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300 text-white shadow-[0_0_30px_rgba(79,70,229,0.6)]' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  {grade.label}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === grade.id ? 'text-indigo-400' : 'text-slate-600'}`}>
                  {grade.id.split('_')[1]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <footer className="mt-32 text-[9px] text-slate-900 font-bold tracking-[0.8em] uppercase mb-16 flex flex-col items-center gap-6">
        <div className="h-px w-32 bg-slate-900"></div>
        <span>LACANIAN ZIWEI RSI TOPOLOGY // 110 SIGNIFIERS MAPPED</span>
      </footer>
    </div>
  );
};

export default App;
