
import React from 'react';
import { SimulationTurn, Language, WorldConfig } from '../types';

interface Props {
  currentTurn: SimulationTurn | null;
  loading: boolean;
  onNext: () => void;
  onMultiNext: () => void;
  onRegenerate: () => void;
  onInsertIncident: (text: string) => void;
  incidentValue: string;
  setIncidentValue: (val: string) => void;
  language: Language;
  config: WorldConfig;
  multiTurnCount: number;
  setMultiTurnCount: (val: number) => void;
  currentStep: number;
}

const VisualDisplay: React.FC<Props> = ({ 
  currentTurn, 
  loading, 
  onNext, 
  onMultiNext,
  onRegenerate,
  onInsertIncident, 
  incidentValue, 
  setIncidentValue,
  language,
  config,
  multiTurnCount,
  setMultiTurnCount,
  currentStep
}) => {
  const t = {
    loading: language === 'en' ? 'Rewriting Reality...' : '正在重构现实...',
    subLoading: language === 'en' ? 'Synthesizing narrative branches' : '正在合成叙事分支',
    awaiting: language === 'en' ? 'Awaiting Signal' : '等待信号',
    impact: language === 'en' ? 'Impact' : '影响',
    placeholder: language === 'en' ? 'Inject custom incident...' : '插入自定义突发事件...',
    inject: language === 'en' ? 'INJECT' : '插入',
    advance: language === 'en' ? 'ADVANCE TIMELINE' : '推进时间轴',
    multiAdvance: language === 'en' ? 'MULTI-TURN ADVANCE' : '多轮连续推进',
    regenerate: language === 'en' ? 'RE-GENERATE' : '重新创意',
    synthesizing: language === 'en' ? 'SYNTHESIZING...' : '合成中...',
    turns: language === 'en' ? 'Turns' : '轮数',
  };

  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 max-w-5xl mx-auto w-full">
        {/* Main Viewport */}
        <div className="w-full aspect-video rounded-xl overflow-hidden glass-panel border border-indigo-500/30 shadow-2xl relative bg-slate-900 group">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/70 z-20">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-indigo-400 font-mono text-sm animate-pulse tracking-widest mb-1 uppercase">
                  {currentStep > 0 ? `${t.synthesizing} (${currentStep}/${multiTurnCount || 1})` : t.loading}
                </p>
                <p className="text-[10px] text-slate-500 italic">{t.subLoading}</p>
              </div>
            </div>
          ) : null}

          {currentTurn?.imageUrl ? (
            <img 
              src={currentTurn.imageUrl} 
              alt="Simulation Scene" 
              className="w-full h-full object-cover transition-opacity duration-700 ease-in-out" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
              <i className="fas fa-satellite-dish text-6xl mb-4 opacity-20"></i>
              <p className="text-lg font-light tracking-wide uppercase opacity-40">{t.awaiting}</p>
            </div>
          )}

          {currentTurn && (
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
              {currentTurn.branchImpact && (
                <div className="mb-2">
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {t.impact}: {currentTurn.branchImpact}
                  </span>
                </div>
              )}
              <p className="text-white text-xl leading-relaxed font-medium line-clamp-4 drop-shadow-md">
                {currentTurn.dialogue}
              </p>
            </div>
          )}
        </div>

        {/* Maintainable Bilingual Event Grid */}
        <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
          {config.eventTemplates.map((event, idx) => {
            const label = language === 'en' ? event.label.en : event.label.zh;
            const text = language === 'en' ? event.text.en : event.text.zh;
            return (
              <button
                key={idx}
                onClick={() => onInsertIncident(text)}
                disabled={loading}
                className="group flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-center disabled:opacity-30"
                title={text}
              >
                <i className={`fas ${event.icon || 'fa-bolt'} text-slate-500 group-hover:text-indigo-400 text-[10px] mb-1`}></i>
                <span className="text-[9px] text-slate-300 font-semibold group-hover:text-slate-100 transition-colors line-clamp-1">
                  {label || (language === 'en' ? `Event ${idx+1}` : `事件 ${idx+1}`)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="text"
              placeholder={t.placeholder}
              className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              value={incidentValue}
              onChange={(e) => setIncidentValue(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && incidentValue.trim()) {
                  onInsertIncident(incidentValue);
                }
              }}
            />
            <button 
              onClick={() => onInsertIncident(incidentValue)}
              disabled={loading || !incidentValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg disabled:opacity-50"
            >
              {t.inject}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={onNext}
              disabled={loading}
              className="col-span-3 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-50 group shadow-xl"
            >
              {loading ? (
                 <span className="animate-pulse">{t.synthesizing}</span>
              ) : (
                <>
                  <i className="fas fa-forward group-hover:translate-x-1 transition-transform"></i>
                  <span>{t.advance}</span>
                </>
              )}
            </button>

            <button 
              onClick={onRegenerate}
              disabled={loading || !currentTurn}
              className="col-span-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center disabled:opacity-50 group"
            >
              <i className="fas fa-redo-alt mb-1 group-hover:rotate-180 transition-transform duration-500"></i>
              <span>{t.regenerate}</span>
            </button>
          </div>

          {/* New Multi-turn Advance Row */}
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={onMultiNext}
              disabled={loading}
              className="col-span-3 py-3 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-100 border border-indigo-700/50 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-3 disabled:opacity-50 group shadow-lg"
            >
              <i className="fas fa-fast-forward group-hover:translate-x-1 transition-transform"></i>
              <span>{t.multiAdvance}</span>
            </button>
            <div className="col-span-1 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center px-3 group focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-2">{t.turns}</span>
              <input 
                type="number"
                min="2"
                max="10"
                value={multiTurnCount}
                onChange={(e) => setMultiTurnCount(parseInt(e.target.value) || 2)}
                disabled={loading}
                className="w-full bg-transparent text-white font-mono font-bold text-center focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDisplay;
