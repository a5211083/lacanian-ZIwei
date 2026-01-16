
import React, { useState, useCallback, useMemo } from 'react';
import { STAR_DATA } from './data';
import { StarMapping, AnalysisState, StarCategory } from './types';
import VisualChart from './components/VisualChart';
import { getDetailedAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    selectedStarId: null,
    selectedCategory: 'ALL',
    loading: false,
    aiInsight: null
  });

  const selectedStar = STAR_DATA.find(s => s.id === state.selectedStarId);

  const filteredStars = useMemo(() => {
    return STAR_DATA.filter(s => state.selectedCategory === 'ALL' || s.category === state.selectedCategory);
  }, [state.selectedCategory]);

  const handleSelectStar = useCallback(async (star: StarMapping) => {
    setState(prev => ({ ...prev, selectedStarId: star.id, loading: true, aiInsight: null }));
    
    try {
      const insight = await getDetailedAnalysis(star);
      setState(prev => ({ ...prev, aiInsight: insight, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const categories = [
    { id: 'ALL', label: '全部' },
    { id: StarCategory.MAIN, label: '十四主星' },
    { id: StarCategory.ASSISTANT, label: '十四辅星' },
    { id: StarCategory.MISC, label: '杂曜' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-rose-400 bg-clip-text text-transparent mb-4">
          Lacanian ZiWei Explorer
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light tracking-[0.2em] uppercase">
          紫微斗数全曜的精神分析图谱
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
        {/* Visualization Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <VisualChart 
            onSelectStar={handleSelectStar} 
            selectedId={state.selectedStarId} 
            filter={state.selectedCategory}
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
                {star.name}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Section */}
        <div className="lg:col-span-4">
          {selectedStar ? (
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold" style={{ color: selectedStar.color }}>{selectedStar.name}</h2>
                    <span className="text-xl text-slate-500 italic font-light">{selectedStar.pinyin}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                    {categories.find(c => c.id === selectedStar.category)?.label}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                   <div className="px-3 py-1 rounded-lg text-xs font-bold tracking-tight bg-slate-950 border border-slate-800" style={{ color: selectedStar.color }}>
                    {selectedStar.realm} · {selectedStar.lacanConcept}
                  </div>
                </div>
              </div>

              <section className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">传统象义</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedStar.traditionalMeaning}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">拉康映射</h3>
                  <p className="text-slate-200 text-sm leading-relaxed italic">"{selectedStar.description}"</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">哲学洞察</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    {selectedStar.philosophicalInsight}
                  </p>
                </div>
              </section>

              <section className="mt-auto bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-inner">
                <h3 className="text-[10px] font-black text-indigo-400 uppercase mb-3 flex items-center gap-2 tracking-tighter">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  Gemini Psychoanalytic Synthesis
                </h3>
                {state.loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-2.5 bg-slate-800 rounded w-full"></div>
                    <div className="h-2.5 bg-slate-800 rounded w-5/6"></div>
                    <div className="h-2.5 bg-slate-800 rounded w-4/6"></div>
                  </div>
                ) : (
                  <div className="text-slate-300 text-xs leading-relaxed font-serif italic opacity-90">
                    {state.aiInsight || "点击星曜，观测深层潜意识的能指运作。"}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-800/40 border-dashed rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 border border-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-700 text-2xl font-thin">
                Ø
              </div>
              <h2 className="text-xl font-light text-slate-500 tracking-widest">主体之缺</h2>
              <p className="text-slate-600 text-sm mt-4 max-w-[240px] leading-relaxed">
                在这里，星曜并非命运的决定者，而是欲望的能指。请选择一颗星曜，开启对自我的彻底分析。
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
          <p>“欲望并非是对某种事物的欲望，而是对匮乏的欲望。”</p>
          <p className="mt-1 font-bold">Lacanian ZiWei Explorer &copy; 2024</p>
        </div>
        <div className="text-right">
          基于 Google Gemini 3 Flash 进行跨学科深度解析
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
