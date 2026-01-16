
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { STAR_DATA } from './data';
import { StarMapping, AnalysisState, StarCategory, Language, AnalysisStyle } from './types';
import VisualChart from './components/VisualChart';
import { getDetailedAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    selectedStarId: null,
    selectedCategory: 'ALL',
    loading: false,
    aiInsight: null,
    language: 'zh',
    style: 'Lacanian'
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = (zh: string, en: string) => (state.language === 'zh' ? zh : en);

  const selectedStar = STAR_DATA.find(s => s.id === state.selectedStarId);

  const filteredStars = useMemo(() => {
    return STAR_DATA.filter(s => state.selectedCategory === 'ALL' || s.category === state.selectedCategory);
  }, [state.selectedCategory]);

  const handleSelectStar = useCallback(async (star: StarMapping) => {
    setState(prev => ({ ...prev, selectedStarId: star.id, loading: true, aiInsight: null }));
    
    try {
      const insight = await getDetailedAnalysis(star, state.language, state.style);
      setState(prev => ({ ...prev, aiInsight: insight, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.language, state.style]);

  useEffect(() => {
    if (selectedStar) {
      handleSelectStar(selectedStar);
    }
  }, [state.language, state.style]);

  const categories = [
    { id: 'ALL', label: t('全部', 'All') },
    { id: StarCategory.MAIN, label: t('十四主星', '14 Main Stars') },
    { id: StarCategory.ASSISTANT, label: t('十四辅星', '14 Assistant') },
    { id: StarCategory.MISC, label: t('杂曜', 'Misc') },
  ];

  const stylesList: { id: AnalysisStyle; label: string; en: string }[] = [
    { id: 'Lacanian', label: '拉康精神分析', en: 'Lacanian Analysis' },
    { id: 'Pictographic', label: '汉字象形本源', en: 'Pictographic' },
    { id: 'Semiotics', label: '索绪尔符号学', en: 'Semiotics' },
    { id: 'Classic', label: '全书原文风格', en: 'Classic Text' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30 font-sans">
      {/* Settings Panel */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full hover:bg-slate-800 transition-all shadow-lg group"
          title={t('设置', 'Settings')}
        >
          <svg className={`w-5 h-5 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90 text-indigo-400' : 'text-slate-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {isSettingsOpen && (
          <div className="absolute top-14 right-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{t('偏好设置', 'Preferences')}</h4>
            
            <div className="space-y-4">
              {/* Language Toggle */}
              <div>
                <label className="text-xs text-slate-400 block mb-2">{t('界面语言', 'UI Language')}</label>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['zh', 'en'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => setState(p => ({ ...p, language: l }))}
                      className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${state.language === l ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {l === 'zh' ? '中文' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interpretation Style */}
              <div>
                <label className="text-xs text-slate-400 block mb-2">{t('诠释风格', 'Interpretation Style')}</label>
                <div className="flex flex-col gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {stylesList.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setState(p => ({ ...p, style: s.id }))}
                      className={`w-full py-2 text-[10px] rounded-md transition-all border border-transparent text-left px-3 ${state.style === s.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {t(s.label, s.en)}
                    </button>
                  ))}
                </div>
                <p className="text-[8px] text-slate-600 mt-2 italic">* {t('不同的解析风格将引导 AI 生成不同维度的洞察', 'Different styles guide AI to generate insights from varying dimensions')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-rose-400 bg-clip-text text-transparent mb-4">
          Lacanian ZiWei Explorer
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light tracking-[0.2em] uppercase">
          {t('紫微斗数全曜的精神分析图谱', 'A Psychoanalytic Map of Zi Wei Dou Shu')}
        </p>
        
        <nav className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setState(prev => ({ ...prev, selectedCategory: cat.id as any, selectedStarId: null }))}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                state.selectedCategory === cat.id 
                ? 'bg-white text-slate-950 border-white' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <VisualChart 
            onSelectStar={handleSelectStar} 
            selectedId={state.selectedStarId} 
            filter={state.selectedCategory}
            lang={state.language}
          />
          
          <div className="flex flex-wrap gap-2 justify-center max-h-[200px] overflow-y-auto p-2 border border-slate-800/30 rounded-lg custom-scrollbar">
            {filteredStars.map(star => (
              <button
                key={star.id}
                onClick={() => handleSelectStar(star)}
                className={`px-3 py-2 rounded text-[11px] font-medium transition-all border ${
                  state.selectedStarId === star.id 
                  ? 'bg-slate-800 border-white text-white shadow-lg shadow-white/5' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600'
                }`}
              >
                {star.name[state.language]}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          {selectedStar ? (
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold" style={{ color: selectedStar.color }}>{selectedStar.name[state.language]}</h2>
                    <span className="text-xl text-slate-500 italic font-light">{selectedStar.pinyin}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                    {categories.find(c => c.id === selectedStar.category)?.label}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                   <div className="px-3 py-1 rounded-lg text-xs font-bold tracking-tight bg-slate-950 border border-slate-800" style={{ color: selectedStar.color }}>
                    {selectedStar.realm} · {selectedStar.lacanConcept[state.language]}
                  </div>
                </div>
              </div>

              <section className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('传统象义', 'Traditional Meaning')}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedStar.traditionalMeaning[state.language]}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('拉康映射', 'Lacanian Mapping')}</h3>
                  <p className="text-slate-200 text-sm leading-relaxed italic">"{selectedStar.description[state.language]}"</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('哲学洞察', 'Philosophical Insight')}</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    {selectedStar.philosophicalInsight[state.language]}
                  </p>
                </div>
              </section>

              <section className="mt-auto bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2 tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    {t(stylesList.find(s => s.id === state.style)?.label || '', stylesList.find(s => s.id === state.style)?.en || '')} Analysis
                  </h3>
                </div>
                {state.loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-2.5 bg-slate-800 rounded w-full"></div>
                    <div className="h-2.5 bg-slate-800 rounded w-5/6"></div>
                    <div className="h-2.5 bg-slate-800 rounded w-4/6"></div>
                  </div>
                ) : (
                  <div className="text-slate-300 text-xs leading-relaxed font-serif italic opacity-90 border-l-2 border-indigo-900/50 pl-3 whitespace-pre-line">
                    {state.aiInsight || t("点击星曜，观测深层潜意识的能指运作。", "Click a star to observe the operation of the subconscious signifier.")}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-800/40 border-dashed rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 border border-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-700 text-2xl font-thin">
                Ø
              </div>
              <h2 className="text-xl font-light text-slate-500 tracking-widest">{t('主体之缺', 'Subjective Lack')}</h2>
              <p className="text-slate-600 text-sm mt-4 max-w-[240px] leading-relaxed">
                {t('在这里，星曜并非命运的决定者，而是欲望的能指。请选择一颗星曜，开启对自我的彻底分析。', 'Here, stars are not determiners of fate, but signifiers of desire. Select a star to begin a thorough analysis of the self.')}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-12 pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px]">
        <div className="flex gap-6">
          <span>R: Real</span>
          <span>S: Symbolic</span>
          <span>I: Imaginary</span>
        </div>
        <div className="text-center">
          <p>{t('“欲望并非是对某种事物的欲望，而是对匮乏的欲望。”', '"Desire is not the desire for an object, but the desire for a lack."')}</p>
          <p className="mt-1 font-bold">Lacanian ZiWei Explorer &copy; 2024</p>
        </div>
        <div className="text-right">
          {t('算力路由引擎：Gemini 3 Flash Hybrid', 'Computing Engine: Gemini 3 Flash Hybrid')}
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
