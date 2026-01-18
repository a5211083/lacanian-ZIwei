import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { STAR_DATA, PALACE_DATA, TRANSFORMATION_DATA } from './data';
import { AnalysisState, StarMapping, Language, AnalysisStyle, ChartPalace, Palace, Transformation, StarCategory, LacanRealm } from './types';
import BirthChart from './components/BirthChart';
import VisualChart from './components/VisualChart';
import { generateZwdsChart, BaziInfo } from './services/zwds_engine';
import { getDetailedAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [chart, setChart] = useState<ChartPalace[]>([]);
  const [viewMode, setViewMode] = useState<'GRID' | 'TOPOLOGY'>('GRID');
  const [isCopied, setIsCopied] = useState(false);
  
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

  // 辅助函数：过滤掉 <think> 标签及其内容
  const formatInsight = (text: string | null) => {
    if (!text) return '';
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
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

  const handleCopy = useCallback(async () => {
    if (!state.aiInsight) return;
    
    // 复制时同样过滤掉 <think> 内容
    const cleanText = formatInsight(state.aiInsight);

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(cleanText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API 失败，尝试回退方案");
      }
    }

    const textArea = document.createElement("textarea");
    textArea.value = cleanText;
    textArea.readOnly = true;
    // @ts-ignore
    textArea.inputMode = 'none';
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = `${window.scrollY}px`;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);

    const isiOS = navigator.userAgent.match(/ipad|iphone/i);
    if (isiOS) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('复制失败', err);
    }

    document.body.removeChild(textArea);
  }, [state.aiInsight]);

  const t = (zh: string, en: string) => (state.language === 'zh' ? zh : en);

  const availableStars = useMemo(() => {
    return STAR_DATA.filter(s => s.category === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center selection:bg-indigo-500/30">
      <header className="w-full max-w-7xl mb-12 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-indigo-300 via-purple-400 to-rose-400 bg-clip-text text-transparent italic leading-tight uppercase tracking-tighter">
            Lacanian ZiWei
          </h1>
          <p className="text-slate-500 text-[10px] tracking-[0.8em] uppercase font-bold mt-4 opacity-60">
            {t('实在 · 象征 · 想象的命理拓扑', 'RSI Topological Mapping System')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={generateRandomChart} 
            className="group relative px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-xs font-black transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 uppercase tracking-[0.4em] overflow-hidden"
          >
            <span className="relative z-10">{t('开始探索随机命盘', 'EXPLORE RANDOM CHART')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
          </button>
          <p className="text-[9px] text-slate-600 font-medium italic opacity-50 uppercase tracking-widest">
            {t('抛弃决定论：点击按钮，在偶然性中遇见你的能指', 'Abandon determinism: click to meet your signifiers in contingency')}
          </p>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        <div className="lg:col-span-7 space-y-8">
           <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/50 w-fit backdrop-blur-md">
              <button onClick={() => setViewMode('GRID')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-600 hover:text-slate-300'}`}>GRID</button>
              <button onClick={() => setViewMode('TOPOLOGY')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'TOPOLOGY' ? 'bg-rose-600 shadow-lg text-white' : 'text-slate-600 hover:text-slate-300'}`}>TOPOLOGY</button>
            </div>

            <div className="w-full transition-all duration-700">
              {viewMode === 'GRID' ? (
                <BirthChart chart={chart} lang={state.language} onSelectStar={handleSelectStar} selectedStarId={state.selectedStar?.id || null} />
              ) : (
                <VisualChart onSelectStar={handleSelectStar} selectedId={state.selectedStar?.id || null} filter="ALL" lang={state.language} />
              )}
            </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all border-indigo-500/5 hover:border-indigo-500/20">
            {state.selectedStar ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex justify-between items-start border-b border-slate-800/30 pb-10">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-black mb-2 flex items-baseline gap-4 tracking-tighter" style={{ color: state.selectedStar.color }}>
                      {state.selectedStar.name[state.language]}
                    </h2>
                    <p className="text-xs text-indigo-400 font-black uppercase tracking-[0.4em] mt-2">{state.selectedStar.lacanConcept[state.language]}</p>
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
                      <label className="text-[9px] text-slate-600 uppercase font-black tracking-widest ml-1">{t('所在宫位', 'TARGET PALACE')}</label>
                      <select value={state.selectedPalace?.id || ''} onChange={(e) => setState(p => ({...p, selectedPalace: PALACE_DATA.find(pd => pd.id === e.target.value) || null}))} className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-bold focus:ring-1 ring-indigo-500 outline-none transition-all text-indigo-100 appearance-none cursor-pointer">
                        <option value="">{t('宫位独立解析', 'INDEPENDENT')}</option>
                        {PALACE_DATA.map(p => <option key={p.id} value={p.id}>{p.name[state.language]}</option>)}
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] text-slate-600 uppercase font-black tracking-widest ml-1">{t('四化能指叠加', 'TRANSFORMATION')}</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {TRANSFORMATION_DATA.map(tr => {
                          const isPossible = state.selectedStar?.canTransform?.[tr.id as keyof typeof state.selectedStar.canTransform];
                          return (
                            <button 
                              key={tr.id} 
                              disabled={!isPossible} 
                              onClick={() => setState(p => ({ ...p, selectedTrans: p.selectedTrans?.id === tr.id ? null : tr }))} 
                              className={`py-3 rounded-xl text-[10px] font-black transition-all border ${!isPossible ? 'opacity-5 grayscale pointer-events-none' : state.selectedTrans?.id === tr.id ? 'bg-white text-slate-950 border-white shadow-xl scale-105' : 'bg-slate-950/50 border-slate-800 hover:border-slate-600'}`} 
                              style={{ color: isPossible && state.selectedTrans?.id !== tr.id ? tr.color : 'inherit' }}
                            >
                              {tr.name[state.language][1]}
                            </button>
                          );
                        })}
                      </div>
                   </div>
                </div>

                <button onClick={executeAnalysis} disabled={state.loading} className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-[2.5rem] font-black text-[11px] tracking-[0.5em] uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-900/30">
                  {state.loading ? t('能指结构生成中...', 'DECODING RSI STRUCTURE...') : t('执行拓扑深度了解', 'EXECUTE ANALYSIS')}
                </button>

                {state.aiInsight && (
                  <div className="bg-slate-950/60 p-8 rounded-[3rem] border border-indigo-500/10 animate-in zoom-in-95 backdrop-blur-md relative group/insight">
                    <button 
                      onClick={handleCopy}
                      className={`absolute top-4 right-4 p-2 rounded-xl border border-slate-800 transition-all opacity-0 group-hover/insight:opacity-100 hover:border-indigo-500 active:scale-90 flex items-center gap-2 ${isCopied ? 'bg-indigo-600 border-indigo-500 text-white opacity-100' : 'bg-slate-900 text-slate-400'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      <span className="text-[10px] font-black tracking-widest">{isCopied ? t('已复制', 'COPIED') : t('复制', 'COPY')}</span>
                    </button>
                    <p className="text-sm leading-relaxed text-slate-300 font-serif italic whitespace-pre-wrap pr-8">
                      {/* 这里对渲染内容进行处理，隐藏 think 标签 */}
                      {formatInsight(state.aiInsight)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center opacity-30 text-center space-y-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/40 animate-spin-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 max-w-[250px] leading-relaxed">
                  {t('点击命盘中的星曜能指\n开始拉康拓扑解码', 'SELECT A SIGNIFIER TO DECODE ITS TOPOLOGICAL STRUCTURE')}
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-8 backdrop-blur-xl">
            <div className="flex gap-8 mb-6 border-b border-slate-800/40 pb-4 overflow-x-auto no-scrollbar">
              {[StarCategory.MAIN, StarCategory.ASSISTANT, StarCategory.MISC].map(cat => (
                <button key={cat} onClick={() => setActiveTab(cat)} className={`text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap pb-1 ${activeTab === cat ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}>
                  {cat === StarCategory.MAIN ? t('14主星', 'Main Stars') : cat === StarCategory.ASSISTANT ? t('14助星', 'Assistant Stars') : t('杂曜精选', 'Misc Stars')}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-3">
              {availableStars.map(star => (
                <button 
                  key={star.id} 
                  onClick={() => handleSelectStar(star)} 
                  className={`px-2 py-3.5 rounded-2xl text-[10px] font-bold border transition-all truncate text-center ${state.selectedStar?.id === star.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
                >
                  {star.name[state.language]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 text-[9px] text-slate-900 font-bold tracking-[0.8em] uppercase mb-16 flex flex-col items-center gap-6">
        <div className="h-px w-32 bg-slate-900"></div>
        <span>LACANIAN ZIWEI RSI TOPOLOGY // POWERED BY GEMINI PRO & IZTRO</span>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;