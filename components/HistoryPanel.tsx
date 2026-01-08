
import React from 'react';
import { SimulationTurn, Language } from '../types';

interface Props {
  history: SimulationTurn[];
  onExport: () => void;
  onReset: () => void;
  onEvaluate: () => void;
  language: Language;
  disabled: boolean;
}

const HistoryPanel: React.FC<Props> = ({ history, onExport, onReset, onEvaluate, language, disabled }) => {
  const t = {
    title: language === 'en' ? 'CHRONICLE LOG' : '编年史记录',
    export: language === 'en' ? 'EXPORT' : '导出',
    reset: language === 'en' ? 'RESET' : '重置',
    evaluate: language === 'en' ? 'EVALUATE' : '剧本评估',
    empty: language === 'en' ? 'No entries in the log yet. Start the simulation.' : '记录中尚无内容。请开始模拟。',
    turn: language === 'en' ? 'TURN' : '轮次',
    incident: language === 'en' ? 'Incident Injected' : '插入的事件',
    vector: language === 'en' ? 'Visual Vector' : '视觉向量',
    confirmReset: language === 'en' ? 'Are you sure you want to clear all progress?' : '确定要清除所有进度并重新开始吗？',
  };

  const handleResetClick = () => {
    if (window.confirm(t.confirmReset)) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel border-l border-slate-800">
      <div className="p-4 border-b border-slate-700 flex flex-col space-y-3 bg-slate-900/50">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold">
          <i className="fas fa-list-ul"></i>
          <span>{t.title}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onExport}
            disabled={disabled || history.length === 0}
            className="flex-1 text-[10px] py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded flex items-center justify-center space-x-1 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-file-export"></i>
            <span>{t.export}</span>
          </button>
          <button 
            onClick={onEvaluate}
            disabled={disabled || history.length === 0}
            className="flex-1 text-[10px] py-1.5 bg-indigo-900/40 hover:bg-indigo-800 border border-indigo-700 rounded flex items-center justify-center space-x-1 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-brain"></i>
            <span>{t.evaluate}</span>
          </button>
          <button 
            onClick={handleResetClick}
            disabled={disabled || history.length === 0}
            className="text-[10px] px-2 py-1.5 bg-red-900/20 hover:bg-red-800 border border-red-700 rounded flex items-center justify-center space-x-1 transition-colors disabled:opacity-50 text-red-400"
          >
            <i className="fas fa-trash-alt"></i>
            <span>{t.reset}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {history.length === 0 ? (
          <div className="text-center text-slate-600 py-10 italic">
            {t.empty}
          </div>
        ) : (
          history.map((turn, idx) => (
            <div key={turn.id} className="relative pl-4 border-l border-indigo-500/30 pb-4 last:pb-0 group">
              <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
              
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{t.turn} #{idx + 1}</span>
                <span className="text-[10px] text-slate-600">
                  {new Date(turn.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {turn.incident && (
                <div className="bg-red-900/20 border border-red-500/30 rounded p-2 mb-2">
                  <span className="text-[9px] font-bold text-red-400 block uppercase">{t.incident}</span>
                  <p className="text-xs text-red-200 italic">"{turn.incident}"</p>
                </div>
              )}

              <p className="text-sm text-slate-300 leading-relaxed font-light italic border-b border-white/5 pb-2">
                {turn.dialogue}
              </p>
              
              <div className="mt-2 rounded overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity">
                 <p className="text-[9px] text-slate-500 truncate mb-1">{t.vector}: {turn.imagePrompt}</p>
                 {turn.imageUrl && (
                    <img src={turn.imageUrl} className="w-full h-20 object-cover rounded" alt="History" />
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
