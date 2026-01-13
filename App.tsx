
import React, { useState, useCallback } from 'react';
import SettingsPanel from './components/SettingsPanel';
import VisualDisplay from './components/VisualDisplay';
import HistoryPanel from './components/HistoryPanel';
import { WorldConfig, SimulationTurn, Language, EventTemplate } from './types';
import { geminiService, EvaluationReport } from './services/geminiService';

const DEFAULT_EVENTS: EventTemplate[] = [
  { 
    label: { en: "Anomalous Rift", zh: "异常裂缝" }, 
    icon: "fa-atom", 
    text: { 
      en: "A sudden rift in reality opens, revealing a parallel version of this world.", 
      zh: "现实中突然出现一道裂缝，展现出这个世界的平行版本。" 
    } 
  },
  { 
    label: { en: "Systemic Failure", zh: "系统崩溃" }, 
    icon: "fa-frown-open", 
    text: { 
      en: "The local infrastructure (social or technical) collapses completely.", 
      zh: "当地基础设施（社会或技术）完全崩溃。" 
    } 
  },
  { 
    label: { en: "Unforeseen Alliance", zh: "意外盟友" }, 
    icon: "fa-handshake", 
    text: { 
      en: "An old enemy arrives and demands a truce for common survival.", 
      zh: "昔日的敌人出现，并为了共同生存要求休战。" 
    } 
  },
  { 
    label: { en: "Forbidden Truth", zh: "禁忌真相" }, 
    icon: "fa-key", 
    text: { 
      en: "A secret is revealed that proves the protagonists' core beliefs were a lie.", 
      zh: "一个被揭开的秘密证明了主角的核心信仰完全是个谎言。" 
    } 
  },
  { 
    label: { en: "Past Echo", zh: "往事回响" }, 
    icon: "fa-history", 
    text: { 
      en: "A long-lost figure from the leads' past returns with an urgent warning.", 
      zh: "主角过去消失已久的人物带着紧急警告归来。" 
    } 
  },
  { 
    label: { en: "Resource Blight", zh: "资源枯竭" }, 
    icon: "fa-leaf", 
    text: { 
      en: "The world's primary energy source begins to drain rapidly due to an unknown parasite.", 
      zh: "由于某种未知的寄生生物，世界的主要能源开始迅速枯竭。" 
    } 
  },
  { 
    label: { en: "Mass Awakening", zh: "集体觉醒" }, 
    icon: "fa-eye", 
    text: { 
      en: "Ordinary civilians begin demonstrating psychic abilities or forbidden knowledge.", 
      zh: "普通平民开始表现出通灵能力或掌握了禁忌的知识。" 
    } 
  },
  { 
    label: { en: "Political Coup", zh: "政权更迭" }, 
    icon: "fa-crown", 
    text: { 
      en: "The governing council is assassinated, plunging the world into jurisdictional chaos.", 
      zh: "统治委员会被暗杀，世界陷入权力真空和法律混乱。" 
    } 
  },
  { 
    label: { en: "Primal Surge", zh: "原生激涌" }, 
    icon: "fa-mountain", 
    text: { 
      en: "The planet itself begins to terraform aggressively, rewriting geography in hours.", 
      zh: "星球本身开始剧烈地进行地形改造，在几小时内重写地理面貌。" 
    } 
  },
  { 
    label: { en: "Echoes of Void", zh: "虚空回响" }, 
    icon: "fa-ghost", 
    text: { 
      en: "The spirits of the forgotten past begin to manifest as physical entities.", 
      zh: "被遗忘过去的灵魂开始体现为实体的存在。" 
    } 
  }
];

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh');
  const [config, setConfig] = useState<WorldConfig>({
    worldDefinition: "A sprawling megacity in 2142 where memories can be bought and sold.",
    protagonistMale: "Jax",
    protagonistFemale: "Elora",
    supportingCharacters: "Riko (Tech Specialist), Silas (Memory Broker)",
    storyOutline: "Jax, a memory dealer, finds a corrupted file that belongs to Elora, a girl who doesn't exist in the city's database.",
    narrativeStyle: "Cyberpunk Noir",
    artStyle: "Cinematic 3D Render",
    dynamicSlots: Array(12).fill("").map((_, i) => i < 3 ? ["Neon palette", "Heavy rain", "Digital ghosts"][i] : ""),
    eventTemplates: DEFAULT_EVENTS
  });

  const [history, setHistory] = useState<SimulationTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [incidentValue, setIncidentValue] = useState("");
  const [multiTurnCount, setMultiTurnCount] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);

  const performSingleTurn = async (currentHistory: SimulationTurn[], incident?: string) => {
    const response = await geminiService.generateTurn(config, currentHistory, language, incident);
    const imageUrl = await geminiService.generateImage(response.imagePrompt, config.artStyle);

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      dialogue: response.dialogue,
      imagePrompt: response.imagePrompt,
      imageUrl,
      incident: incident,
      branchImpact: response.branchImpact
    };
  };

  const handleNextTurn = useCallback(async (incident?: string, replaceLast = false) => {
    if (loading) return;
    setLoading(true);
    setCurrentStep(1);

    try {
      const activeHistory = replaceLast ? history.slice(0, -1) : history;
      const newTurn = await performSingleTurn(activeHistory, incident);

      if (replaceLast) {
        setHistory(prev => [...prev.slice(0, -1), newTurn]);
      } else {
        setHistory(prev => [...prev, newTurn]);
      }
      setIncidentValue("");
    } catch (error) {
      console.error("Simulation error:", error);
      const errorMsg = language === 'zh' ? "模拟失败：数据流中出现悖论。" : "Simulation failed due to a paradox in the data stream.";
      alert(errorMsg);
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  }, [config, history, loading, language]);

  const handleMultiTurnNext = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    let tempHistory = [...history];
    try {
      for (let i = 0; i < multiTurnCount; i++) {
        setCurrentStep(i + 1);
        const newTurn = await performSingleTurn(tempHistory);
        tempHistory.push(newTurn);
        setHistory([...tempHistory]);
      }
    } catch (error) {
      console.error("Multi-turn simulation error:", error);
      const errorMsg = language === 'zh' ? "多轮模拟中断：时间线出现分叉。" : "Multi-turn simulation interrupted: Timeline split detected.";
      alert(errorMsg);
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  }, [config, history, loading, language, multiTurnCount]);

  const handleInsertIncident = (incident: string) => {
    if (!incident.trim()) return;
    handleNextTurn(incident);
  };

  const handleRegenerate = () => {
    if (history.length === 0) return;
    const lastTurn = history[history.length - 1];
    handleNextTurn(lastTurn.incident, true);
  };

  const handleReset = () => {
    setHistory([]);
    setEvaluationReport(null);
    setIncidentValue("");
  };

  const handleEvaluate = async () => {
    if (history.length === 0 || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const report = await geminiService.evaluateScript(config, history, language);
      setEvaluationReport(report);
    } catch (error) {
      console.error("Evaluation error:", error);
      alert(language === 'zh' ? "评估过程中断。" : "Evaluation interrupted.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const t = {
      title: language === 'zh' ? '世界模拟器记录' : 'OmniWorld Simulation Log',
      presets: language === 'zh' ? '世界预设' : 'World Presets',
      world: language === 'zh' ? '世界观' : 'World',
      outline: language === 'zh' ? '故事大纲' : 'Story Outline',
      style: language === 'zh' ? '风格' : 'Style',
      art: language === 'zh' ? '出图画风' : 'Art Style',
      turn: language === 'zh' ? '轮次' : 'TURN',
      incident: language === 'zh' ? '关键干预' : 'Critical Intervention',
      impact: language === 'zh' ? '分支影响' : 'Branch Impact',
    };

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <title>${t.title}</title>
        <style>
          body { font-family: sans-serif; background: #121212; color: #eee; max-width: 900px; margin: 40px auto; padding: 20px; }
          .header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 40px; }
          .config { background: #1e1e1e; padding: 20px; border-radius: 8px; margin-bottom: 40px; font-size: 0.9em; }
          .turn { margin-bottom: 60px; border-bottom: 1px solid #333; padding-bottom: 40px; }
          img { max-width: 100%; border-radius: 8px; display: block; margin: 20px 0; }
          .impact { color: #818cf8; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header"><h1>${t.title}</h1></div>
        <div class="config"><h2>${t.presets}</h2><p>${config.worldDefinition}</p></div>
        ${history.map((turn, i) => `
          <div class="turn">
            <h3>${t.turn} #${i + 1}</h3>
            ${turn.incident ? `<p><i>${t.incident}: ${turn.incident}</i></p>` : ''}
            <p class="impact">${t.impact}: ${turn.branchImpact}</p>
            <p>${turn.dialogue}</p>
            ${turn.imageUrl ? `<img src="${turn.imageUrl}" />` : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniWorld-Log-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0c] overflow-hidden relative">
      {evaluationReport && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-500/30 p-8 flex flex-col space-y-6">
             <div className="flex justify-between items-center border-b border-slate-700 pb-4">
              <h2 className="text-2xl font-bold text-indigo-400">{language === 'zh' ? '评估报告' : 'Insight Report'}</h2>
              <button onClick={() => setEvaluationReport(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <span className="text-xs text-indigo-400 font-bold block mb-1">SCORE: {evaluationReport.overallScore}/10</span>
                <p className="text-sm">{evaluationReport.plotConsistency}</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl"><p className="text-sm">{evaluationReport.characterDevelopment}</p></div>
              <div className="p-4 bg-slate-900/50 rounded-xl"><p className="text-sm">{evaluationReport.worldBuilding}</p></div>
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 italic text-sm">{evaluationReport.suggestions}</div>
            </div>
          </div>
        </div>
      )}

      <div className="w-[350px] flex-shrink-0">
        <SettingsPanel 
          config={config} 
          setConfig={setConfig} 
          disabled={loading || isEvaluating} 
          language={language}
        />
      </div>

      <div className="flex-1 overflow-hidden relative">
        <VisualDisplay 
          currentTurn={history[history.length - 1] || null}
          loading={loading || isEvaluating}
          onNext={() => handleNextTurn()}
          onMultiNext={handleMultiTurnNext}
          onRegenerate={handleRegenerate}
          onInsertIncident={handleInsertIncident}
          incidentValue={incidentValue}
          setIncidentValue={setIncidentValue}
          language={language}
          config={config}
          multiTurnCount={multiTurnCount}
          setMultiTurnCount={setMultiTurnCount}
          currentStep={currentStep}
        />
      </div>

      <div className="w-[380px] flex-shrink-0">
        <HistoryPanel 
          history={history} 
          onExport={handleExport} 
          onReset={handleReset}
          onEvaluate={handleEvaluate}
          language={language}
          disabled={loading || isEvaluating}
        />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-full flex items-center space-x-4 backdrop-blur-xl pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-2">
             <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
             <span className="text-[10px] font-mono font-bold uppercase text-slate-300">
               {loading ? (language === 'zh' ? `模拟中 [${currentStep}/${multiTurnCount || 1}]` : `SIMULATING [${currentStep}/${multiTurnCount || 1}]`) : (language === 'zh' ? '就绪' : 'READY')}
             </span>
          </div>
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
            className="flex items-center space-x-1 hover:text-indigo-400 transition-colors"
          >
            <i className="fas fa-language"></i>
            <span className="text-[10px] font-black uppercase">{language === 'en' ? 'EN' : 'ZH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
