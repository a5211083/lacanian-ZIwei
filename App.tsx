
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { STAR_DATA, PALACE_DATA, TRANSFORMATION_DATA, STAR_TRANSFORMATIONS } from './data';
import { StarMapping, AnalysisState, StarCategory, Language, AnalysisStyle, Palace, Transformation } from './types';
import VisualChart from './components/VisualChart';
import BirthChart from './components/BirthChart';
import { getDetailedAnalysis, getPalaceStarAnalysis } from './services/gemini';
import { generateZwdsChart } from './services/zwds_engine';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    selectedStarId: null,
    selectedCategory: 'ALL',
    loading: false,
    aiInsight: null,
    language: 'zh',
    style: 'Lacanian',
    selectedPalaceId: 'life',
    selectedTransformationId: null,
    birthDate: new Date().toISOString().split('T')[0],
    birthHour: 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    generatedChart: null
  });

  const [palaceInsight, setPalaceInsight] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = (zh: string, en: string) => (state.language === 'zh' ? zh : en);

  const selectedStar = STAR_DATA.find(s => s.id === state.selectedStarId);
  const selectedPalace = PALACE_DATA.find(p => p.id === state.selectedPalaceId);
  const selectedTransformation = TRANSFORMATION_DATA.find(tf => tf.id === state.selectedTransformationId);

  const handleSelectStar = useCallback(async (star: StarMapping) => {
    setState(prev => ({ ...prev, selectedStarId: star.id, loading: true, aiInsight: null }));
    try {
      const insight = await getDetailedAnalysis(star, state.language, state.style);
      setState(prev => ({ ...prev, aiInsight: insight, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.language, state.style]);

  const handleGenerateChart = () => {
    setErrorMsg(null);
    try {
      const chart = generateZwdsChart(state.birthDate, state.birthHour, state.timezone);
      setState(prev => ({ ...prev, generatedChart: chart }));
      setTimeout(() => {
        document.getElementById('birth-chart-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error("Chart generation error:", err);
      setErrorMsg(t("排盘失败，请检查日期格式或更换浏览器尝试。", "Chart generation failed. Please check the date format or try a different browser."));
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => ({
    val: i + 1,
    label: ['子 (23-01)', '丑 (01-03)', '寅 (03-05)', '卯 (05-07)', '辰 (07-09)', '巳 (09-11)', '午 (11-13)', '未 (13-15)', '申 (15-17)', '酉 (17-19)', '戌 (19-21)', '亥 (21-23)'][i]
  }));

  // Common timezones for easy selection
  const commonTimezones = [
    { label: '中国标准时间 (GMT+8)', value: 'Asia/Shanghai' },
    { label: '台北标准时间 (GMT+8)', value: 'Asia/Taipei' },
    { label: '香港标准时间 (GMT+8)', value: 'Asia/Hong_Kong' },
    { label: '东京标准时间 (GMT+9)', value: 'Asia/Tokyo' },
    { label: '伦敦/格林威治 (GMT+0)', value: 'Europe/London' },
    { label: '纽约 (GMT-5)', value: 'America/New_York' },
    { label: '洛杉矶 (GMT-8)', value: 'America/Los_Angeles' },
    { label: '巴黎 (GMT+1)', value: 'Europe/Paris' },
    { label: '首尔 (GMT+9)', value: 'Asia/Seoul' },
    { label: '新加坡 (GMT+8)', value: 'Asia/Singapore' },
    { label: '悉尼 (GMT+11)', value: 'Australia/Sydney' },
    { label: 'UTC', value: 'UTC' }
  ];

  const stylesList: { id: AnalysisStyle; label: string; en: string }[] = [
    { id: 'Lacanian', label: '拉康精神分析', en: 'Lacanian Analysis' },
    { id: 'Pictographic', label: '汉字象形本源', en: 'Pictographic' },
    { id: 'Semiotics', label: '索绪尔符号学', en: 'Semiotics' },
    { id: 'Classic', label: '全书原文风格', en: 'Classic Text' },
  ];

  const categories = [
    { id: 'ALL', label: t('全部', 'All') },
    { id: StarCategory.MAIN, label: t('十四主星', '14 Main Stars') },
    { id: StarCategory.ASSISTANT, label: t('十四辅星', '14 Assistant') },
    { id: StarCategory.MISC, label: t('杂曜', 'Misc') },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-purple-500/30 font-sans">
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full hover:bg-slate-800 transition-all shadow-lg group"
        >
          <svg className={`w-5 h-5 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90 text-indigo-400' : 'text-slate-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        {isSettingsOpen && (
          <div className="absolute top-14 right-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{t('偏好设置', 'Preferences')}</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2">{t('界面语言', 'UI Language')}</label>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['zh', 'en'] as Language[]).map(l => (
                    <button key={l} onClick={() => setState(p => ({ ...p, language: l }))} className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${state.language === l ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{l === 'zh' ? '中文' : 'English'}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-2">{t('诠释风格', 'Interpretation Style')}</label>
                <div className="flex flex-col gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {stylesList.map(s => (
                    <button key={s.id} onClick={() => setState(p => ({ ...p, style: s.id }))} className={`w-full py-2 text-[10px] rounded-md transition-all border border-transparent text-left px-3 ${state.style === s.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{t(s.label, s.en)}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-rose-400 bg-clip-text text-transparent mb-4">Lacanian ZiWei Explorer</h1>
        <p className="text-slate-400 text-lg md:text-xl font-light tracking-[0.2em] uppercase">{t('紫微斗数全曜的精神分析图谱', 'A Psychoanalytic Map of Zi Wei Dou Shu')}</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setState(prev => ({ ...prev, selectedCategory: cat.id as any, selectedStarId: null }))} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${state.selectedCategory === cat.id ? 'bg-white text-slate-950 border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>{cat.label}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <VisualChart onSelectStar={handleSelectStar} selectedId={state.selectedStarId} filter={state.selectedCategory} lang={state.language} />
        </div>
        <div className="lg:col-span-4">
          {selectedStar ? (
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold" style={{ color: selectedStar.color }}>{selectedStar.name[state.language]}</h2>
                  <span className="text-xl text-slate-500 italic font-light">{selectedStar.pinyin}</span>
                </div>
                <div className="mt-4">
                   <div className="px-3 py-1 rounded-lg text-xs font-bold tracking-tight bg-slate-950 border border-slate-800 inline-block" style={{ color: selectedStar.color }}>{selectedStar.realm} · {selectedStar.lacanConcept[state.language]}</div>
                </div>
              </div>
              <section className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('传统象义', 'Traditional Meaning')}</h3><p className="text-slate-300 text-sm leading-relaxed">{selectedStar.traditionalMeaning[state.language]}</p></div>
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('拉康映射', 'Lacanian Mapping')}</h3><p className="text-slate-200 text-sm leading-relaxed italic">"{selectedStar.description[state.language]}"</p></div>
                <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('哲学洞察', 'Philosophical Insight')}</h3><p className="text-slate-400 text-sm font-light leading-relaxed">{selectedStar.philosophicalInsight[state.language]}</p></div>
              </section>
              <section className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-inner">
                {state.loading ? <div className="space-y-3 animate-pulse"><div className="h-2.5 bg-slate-800 rounded w-full"></div><div className="h-2.5 bg-slate-800 rounded w-5/6"></div></div> : <div className="text-slate-300 text-xs leading-relaxed font-serif italic opacity-90 border-l-2 border-indigo-900/50 pl-3 whitespace-pre-line">{state.aiInsight || t("点击星曜，观测深层潜意识的能指运作。", "Click a star to observe the operation of the subconscious signifier.")}</div>}
              </section>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-800/40 border-dashed rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 border border-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-700 text-2xl font-thin">Ø</div>
              <h2 className="text-xl font-light text-slate-500 tracking-widest">{t('主体之缺', 'Subjective Lack')}</h2>
              <p className="text-slate-600 text-sm mt-4 max-w-[240px] leading-relaxed">{t('星曜并非命运，而是欲望的能指。请选择一颗星曜。', 'Select a star to begin analysis.')}</p>
            </div>
          )}
        </div>
      </main>

      <section id="birth-chart-section" className="max-w-7xl mx-auto border-t border-slate-900 pt-12 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-4">
              <span className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center text-sm">M</span>{t('生成紫微斗数命盘', 'Generate Zi Wei Dou Shu Chart')}
            </h2>
            <p className="text-slate-500 text-xs italic">{t('备注：本网页生成的命盘仅供参考，实际分析请用专业排盘软件', 'Note: This chart is for reference only.')}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">{t('出生日期', 'Birth Date')}</label>
              <input type="date" value={state.birthDate} onChange={(e) => setState(prev => ({ ...prev, birthDate: e.target.value }))} className="bg-slate-950 border border-slate-800 text-xs p-2 rounded-lg text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">{t('出生时辰', 'Birth Hour')}</label>
              <select value={state.birthHour} onChange={(e) => setState(prev => ({ ...prev, birthHour: parseInt(e.target.value) }))} className="bg-slate-950 border border-slate-800 text-xs p-2 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                {hours.map(h => <option key={h.val} value={h.val}>{h.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">{t('出生时区', 'Birth Timezone')}</label>
              <select value={state.timezone} onChange={(e) => setState(prev => ({ ...prev, timezone: e.target.value }))} className="bg-slate-950 border border-slate-800 text-xs p-2 rounded-lg text-white focus:outline-none focus:border-indigo-500 max-w-[150px]">
                {commonTimezones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                {!commonTimezones.find(tz => tz.value === state.timezone) && (
                  <option value={state.timezone}>{state.timezone}</option>
                )}
              </select>
            </div>
            <button onClick={handleGenerateChart} className="mt-4 md:mt-0 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-rose-600/20">{t('排盘', 'Plot Chart')}</button>
          </div>
        </div>

        {errorMsg && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-center text-xs">{errorMsg}</div>}

        {state.generatedChart ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <BirthChart chart={state.generatedChart} lang={state.language} onSelectStar={handleSelectStar} selectedStarId={state.selectedStarId} />
          </div>
        ) : (
          <div className="h-64 border-2 border-dashed border-slate-900 rounded-3xl flex items-center justify-center text-slate-700">
            <p className="text-sm font-light italic">{t('输入日期点击“排盘”，投射您的欲望轨迹。', 'Enter date and plot chart.')}</p>
          </div>
        )}
      </section>

      <footer className="max-w-7xl mx-auto mt-20 pb-12 pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px]">
        <div className="flex gap-6"><span>R: Real</span><span>S: Symbolic</span><span>I: Imaginary</span></div>
        <div className="text-center"><p className="mt-1 font-bold">Lacanian ZiWei Explorer &copy; 2024</p></div>
        <div className="text-right">{t('算力路由引擎：Gemini 3 Flash Hybrid', 'Computing Engine: Gemini 3 Flash Hybrid')}</div>
      </footer>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }`}</style>
    </div>
  );
};

export default App;
