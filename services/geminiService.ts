
import { GoogleGenAI, Type } from "@google/genai";
import { WorldConfig, SimulationTurn, SimulationResponse, Language } from "../types";

const API_KEY = process.env.API_KEY || "";

export interface EvaluationReport {
  plotConsistency: string;
  characterDevelopment: string;
  worldBuilding: string;
  thematicDepth: string;
  overallScore: number;
  suggestions: string;
}

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async generateTurn(
    config: WorldConfig,
    history: SimulationTurn[],
    language: Language,
    incident?: string
  ): Promise<SimulationResponse> {
    const historyText = history
      .slice(-10)
      .map(t => `[Turn]: ${t.dialogue}${t.incident ? `\n[Incident]: ${t.incident}` : ""}`)
      .join("\n\n");

    const dynamicInfo = config.dynamicSlots
      .filter(s => s.trim() !== "")
      .map((s, i) => `Variable ${i + 1}: ${s}`)
      .join("\n");

    const langInstruction = language === 'zh' 
      ? "IMPORTANT: You must output the 'dialogue' and 'branchImpact' fields in Chinese (Simplified)."
      : "IMPORTANT: You must output the 'dialogue' and 'branchImpact' fields in English.";

    const prompt = `
      System Instruction: You are a Master World Architect and Narrator. 
      Your goal is to simulate a complex, branching narrative based on the user's world presets.
      
      ${langInstruction}

      WORLD CONTEXT:
      - Setting: ${config.worldDefinition}
      - Primary Leads: ${config.protagonistMale} & ${config.protagonistFemale}
      - Supporting Character Pool: ${config.supportingCharacters || "None defined."}
      - Core Conflict: ${config.storyOutline}
      - Tone: ${config.narrativeStyle}
      - Visual Aesthetic: ${config.artStyle}
      ${dynamicInfo}

      CHRONICLE HISTORY (Last 10 Turns):
      ${historyText}

      CURRENT INPUT:
      ${incident ? `CRITICAL INTERVENTION / SUDDEN EVENT: ${incident}` : "Continue the natural progression of the current branch."}

      STORYTELLING RULES:
      1. NARRATIVE BRANCHING: Analyze the history. Each turn should feel like a meaningful consequence of previous actions.
      2. DYNAMIC CHARACTERS: 
         - Use characters from the 'Supporting Character Pool' when narratively appropriate. 
         - DO NOT have every supporting character appear in every turn. 
         - Characters should enter or leave scenes naturally based on the logic of the dialogue and situation.
      3. CHARACTER DEPTH: Dialogue should reveal shifting relationships.
      4. CAUSALITY: Explicitly consider how this turn affects future paths.
      5. VISUAL PROMPT: Create a detailed DALL-E style prompt (in English for the image generator) for a cinematic image reflecting the scene.

      Return the response as JSON.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dialogue: {
              type: Type.STRING,
              description: "The next segment of narrative/dialogue.",
            },
            imagePrompt: {
              type: Type.STRING,
              description: "Visual prompt for image generation (keep in English).",
            },
            branchImpact: {
              type: Type.STRING,
              description: "Short analysis of how this turn affects the narrative direction.",
            },
          },
          required: ["dialogue", "imagePrompt", "branchImpact"],
        },
      },
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return {
        dialogue: language === 'zh' ? "时间线动摇了... 命运的丝线纠缠在一起。" : "The timeline wavers... the threads of fate are tangled.",
        imagePrompt: "A fractured mirror reflecting a swirling nebula",
        branchImpact: language === 'zh' ? "时空不稳定" : "Temporal Instability"
      };
    }
  }

  async generateImage(imagePrompt: string, artStyle: string): Promise<string | undefined> {
    const finalPrompt = `${imagePrompt}. Aesthetic: ${artStyle}. Masterpiece, high resolution, atmospheric.`;
    
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  }

  async evaluateScript(config: WorldConfig, history: SimulationTurn[], language: Language): Promise<EvaluationReport> {
    const fullHistory = history.map((t, i) => `Turn ${i+1}: ${t.dialogue}`).join('\n\n');
    
    const langInstruction = language === 'zh' 
      ? "Respond in Chinese (Simplified)."
      : "Respond in English.";

    const prompt = `
      As a Senior Narrative Consultant, evaluate the following generated story script based on the world settings provided.
      
      WORLD SETTINGS:
      ${JSON.stringify(config)}

      STORY LOG:
      ${fullHistory}

      ${langInstruction}

      Evaluate based on:
      1. Plot Consistency: Does the logic hold up?
      2. Character Development: Is there growth or depth in ${config.protagonistMale} and ${config.protagonistFemale}?
      3. World Building: How well is the setting utilized?
      4. Supporting Cast: Does the appearance and exit of secondary characters feel natural?
      5. Thematic Depth: Are there meaningful underlying messages?
      6. Provide an overall score (1-10) and suggestions for future turns.

      Return the evaluation in JSON format.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plotConsistency: { type: Type.STRING },
            characterDevelopment: { type: Type.STRING },
            worldBuilding: { type: Type.STRING },
            thematicDepth: { type: Type.STRING },
            overallScore: { type: Type.NUMBER },
            suggestions: { type: Type.STRING },
          },
          required: ["plotConsistency", "characterDevelopment", "worldBuilding", "thematicDepth", "overallScore", "suggestions"],
        },
      },
    });

    return JSON.parse(response.text);
  }
}

export const geminiService = new GeminiService();
