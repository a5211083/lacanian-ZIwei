
import React, { useState, useCallback } from 'react';
import { STAR_DATA } from './data';
import { StarMapping, AnalysisState } from './types';
import VisualChart from './components/VisualChart';
import { getDetailedAnalysis } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    selectedStarId: null,
    loading: false,
    aiInsight: null
  });

  const selectedStar = STAR_DATA.find(s => s.id === state.selectedStarId);

  const handleSelectStar = useCallback(async (star: StarMapping) => {
    setState(prev => ({ ...prev, selectedStarId: star.id, loading: true, aiInsight: null }));
    
    try {
      const insight = await getDetailedAnalysis(star);
      setState(prev => ({ ...prev, aiInsight: insight, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent mb-4">
          Lacanian ZiWei
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light tracking-widest uppercase">
          紫微斗数十四主星的精神分析图谱
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 象征界 Symbolic</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 想象界 Imaginary</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 实在界 Real</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualization Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <VisualChart onSelectStar={handleSelectStar} selectedId={state.selectedStarId} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {STAR_DATA.map(star => (
              <button
                key={star.id}
                onClick={() => handleSelectStar(star)}
                className={`p-2 rounded text-xs transition-all border ${
                  state.selectedStarId === star.id 
                  ? 'bg-slate-800 border-white text-white scale-105 shadow-lg shadow-white/10' 
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
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold" style={{ color: selectedStar.color }}>{selectedStar.name}</h2>
                  <span className="text-xl text-slate-500 italic">{selectedStar.pinyin}</span>
                </div>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold tracking-tighter bg-slate-800" style={{ color: selectedStar.color }}>
                  {selectedStar.realm} · {selectedStar.lacanConcept}
                </div>
              </div>

              <section>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">传统象义</h3>
                <p className="text-slate-300 leading-relaxed">{selectedStar.traditionalMeaning}</p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">拉康映射</h3>
                <p className="text-slate-300 leading-relaxed italic">{selectedStar.description}</p>
                <p className="mt-2 text-slate-400 text-sm font-light">
                  {selectedStar.philosophicalInsight}
                </p>
              </section>

              <section className="mt-auto bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <h3 className="text-xs font-bold text-purple-400 uppercase mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Gemini 哲学深度解析
                </h3>
                {state.loading ? (
                  <div className="flex flex-col gap-2 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-800 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {state.aiInsight || "点击星曜，开启深度精神分析之窗。"}
                  </p>
                )}
              </section>
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800/50 border-dashed rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-2 border-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-600">
                ?
              </div>
              <h2 className="text-xl font-medium text-slate-500">选择一颗星曜</h2>
              <p className="text-slate-600 text-sm mt-2 max-w-[200px]">
                点击左侧图表中的节点，探索东方星命学与现代拉康精神分析的交汇点。
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-slate-600 text-center text-xs">
        <p>基于拉康三界 (RSI) 理论的紫微斗数建模 &copy; 2024 LacanZiWei Explorations</p>
        <p className="mt-1">“欲望是它者的欲望。” —— 雅克·拉康</p>
      </footer>
    </div>
  );
};

export default App;
