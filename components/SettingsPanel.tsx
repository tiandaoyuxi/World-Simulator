
import React, { useState } from 'react';
import { WorldConfig, Language, EventTemplate } from '../types';

interface Props {
  config: WorldConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorldConfig>>;
  disabled: boolean;
  language: Language;
}

const NARRATIVE_PRESETS = [
  "Cyberpunk Noir", "Epic High Fantasy", "Existential Horror", "Witty Romance", 
  "Historical Drama", "Space Opera", "Lovecraftian Mystery", "Steampunk Adventure", 
  "Hardboiled Detective", "Surrealist Dream", "Post-Apocalyptic Survival", "Magical Realism",
  "Grimdark War", "Slice of Life", "Urban Fantasy"
];

const ART_PRESETS = [
  "Cinematic 3D Render", "Hyper-Realistic", "Studio Ghibli Anime", "Oil Painting", 
  "Dark Comic Book", "Cyberpunk Neon", "16-bit Pixel Art", "Watercolor", 
  "Noir Photography", "Retro Sci-fi Poster", "Ukiyo-e Woodblock", "Renaissance Fresco",
  "Unreal Engine 5", "Gothic Sketch", "Abstract Expressionism"
];

const SettingsPanel: React.FC<Props> = ({ config, setConfig, disabled, language }) => {
  const [activeTab, setActiveTab] = useState<'vars' | 'events'>('vars');

  const t = {
    title: language === 'en' ? 'WORLD ARCHITECT' : '世界架构师',
    tabVars: language === 'en' ? 'Variables' : '核心变量',
    tabEvents: language === 'en' ? 'Events' : '突发模版',
    worldDef: language === 'en' ? 'World Definition' : '世界观定义',
    maleLead: language === 'en' ? 'Male Lead' : '男主角名',
    femaleLead: language === 'en' ? 'Female Lead' : '女主角名',
    supportingChars: language === 'en' ? 'Supporting Characters' : '配角信息',
    charsHint: language === 'en' ? 'Use commas to separate (e.g. Jack, Mary)' : '使用逗号分隔多个角色 (如: 张三, 李四)',
    outline: language === 'en' ? 'Story Outline' : '故事大纲',
    style: language === 'en' ? 'Narrative Style' : '叙事风格',
    art: language === 'en' ? 'Art Style' : '出图画风',
    dynamic: language === 'en' ? 'Dynamic Modules (12)' : '动态补充信息 (12条)',
    placeholderWorld: language === 'en' ? 'e.g. A floating steampunk city...' : '例如：一个浮空的蒸汽朋克城市...',
    placeholderVar: language === 'en' ? 'Variable' : '变量',
    eventLabelEn: language === 'en' ? 'Label (EN)' : '标签 (英文)',
    eventLabelZh: language === 'en' ? 'Label (ZH)' : '标签 (中文)',
    eventTextEn: language === 'en' ? 'Description (EN)' : '描述 (英文)',
    eventTextZh: language === 'en' ? 'Description (ZH)' : '描述 (中文)',
    customInput: language === 'en' ? 'Type or select style...' : '输入或选择风格...',
  };

  const handleChange = (key: keyof WorldConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleDynamicSlotChange = (index: number, value: string) => {
    const newSlots = [...config.dynamicSlots];
    newSlots[index] = value;
    handleChange('dynamicSlots', newSlots);
  };

  const handleEventChange = (index: number, field: string, subField: string | null, value: string) => {
    const newEvents = [...config.eventTemplates];
    if (subField) {
      (newEvents[index] as any)[field][subField] = value;
    } else {
      (newEvents[index] as any)[field] = value;
    }
    handleChange('eventTemplates', newEvents);
  };

  return (
    <div className="flex flex-col h-full glass-panel border-r border-slate-800">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-lg mb-4">
          <i className="fas fa-drafting-compass"></i>
          <span>{t.title}</span>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('vars')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'vars' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.tabVars}
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'events' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.tabEvents}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'vars' ? (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.worldDef}</label>
              <textarea
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none h-20 resize-none transition-all"
                value={config.worldDefinition}
                onChange={(e) => handleChange('worldDefinition', e.target.value)}
                disabled={disabled}
                placeholder={t.placeholderWorld}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.maleLead}</label>
                <input
                  type="text"
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={config.protagonistMale}
                  onChange={(e) => handleChange('protagonistMale', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.femaleLead}</label>
                <input
                  type="text"
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={config.protagonistFemale}
                  onChange={(e) => handleChange('protagonistFemale', e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.supportingChars}</label>
              <input
                type="text"
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                value={config.supportingCharacters}
                onChange={(e) => handleChange('supportingCharacters', e.target.value)}
                disabled={disabled}
                placeholder={t.charsHint}
              />
              <p className="text-[9px] text-slate-600 mt-1 italic">{t.charsHint}</p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.outline}</label>
              <textarea
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none h-16 resize-none transition-all"
                value={config.storyOutline}
                onChange={(e) => handleChange('storyOutline', e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.style}</label>
                <input
                  type="text"
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={config.narrativeStyle}
                  onChange={(e) => handleChange('narrativeStyle', e.target.value)}
                  disabled={disabled}
                  placeholder={t.customInput}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {NARRATIVE_PRESETS.map(preset => (
                    <button
                      key={preset}
                      onClick={() => handleChange('narrativeStyle', preset)}
                      className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${config.narrativeStyle === preset ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.art}</label>
                <input
                  type="text"
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={config.artStyle}
                  onChange={(e) => handleChange('artStyle', e.target.value)}
                  disabled={disabled}
                  placeholder={t.customInput}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {ART_PRESETS.map(preset => (
                    <button
                      key={preset}
                      onClick={() => handleChange('artStyle', preset)}
                      className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${config.artStyle === preset ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <label className="text-[10px] font-bold text-indigo-400 uppercase block mb-3">{t.dynamic}</label>
              <div className="grid grid-cols-1 gap-2">
                {config.dynamicSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-[9px] text-slate-500 font-mono w-4">{index + 1}</span>
                    <input
                      type="text"
                      className="flex-1 bg-slate-900/50 border border-slate-800 rounded-md p-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={slot}
                      onChange={(e) => handleDynamicSlotChange(index, e.target.value)}
                      disabled={disabled}
                      placeholder={`${t.placeholderVar} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-[10px] text-slate-500 italic mb-2">Maintain 10 bilingual event templates. Icons are FontAwesome classes.</p>
            {config.eventTemplates.map((ev, index) => (
              <div key={index} className="bg-slate-900/30 border border-slate-800 p-3 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-indigo-500 font-bold tracking-tighter">EVENT #{index + 1}</span>
                  <input 
                    className="bg-slate-950 border border-slate-700 text-[10px] text-slate-400 px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={ev.icon}
                    onChange={(e) => handleEventChange(index, 'icon', null, e.target.value)}
                    placeholder="icon (fa-atom)"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-600 uppercase block">{t.eventLabelZh}</label>
                    <input
                      type="text"
                      className="w-full mt-0.5 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={ev.label.zh}
                      onChange={(e) => handleEventChange(index, 'label', 'zh', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-600 uppercase block">{t.eventLabelEn}</label>
                    <input
                      type="text"
                      className="w-full mt-0.5 bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={ev.label.en}
                      onChange={(e) => handleEventChange(index, 'label', 'en', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-600 uppercase block">{t.eventTextZh}</label>
                    <textarea
                      className="w-full mt-0.5 bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 h-10 resize-none focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={ev.text.zh}
                      onChange={(e) => handleEventChange(index, 'text', 'zh', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-600 uppercase block">{t.eventTextEn}</label>
                    <textarea
                      className="w-full mt-0.5 bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 h-10 resize-none focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={ev.text.en}
                      onChange={(e) => handleEventChange(index, 'text', 'en', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
