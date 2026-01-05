
import { GoogleGenAI, Modality } from "@google/genai";
import { SummaryConfig } from "../types";
import { decodeBase64, decodeAudioData } from "../utils/audioUtils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateSummaryText(articles: string[], config: SummaryConfig): Promise<string> {
  const topicsStr = config.topics.length > 0 ? config.topics.join(', ') : 'General news';
  
  const prompt = `
    You are a professional radio news anchor. 
    Summarize the following news articles into a cohesive, flowing script for a personal audio briefing.
    
    Tonal preference: ${config.tone}
    User Interests: ${topicsStr}
    Specific focus areas: ${config.focus || 'None specified'}
    
    PRIORITIZATION RULE: Give more depth, time, and focus to articles that match the User Interests (${topicsStr}). 
    If an article doesn't match these interests, provide a very brief "In other news" summary of it.
    
    Articles:
    ${articles.map((a, i) => `Article ${i + 1}: ${a}`).join('\n\n')}
    
    Rules for the script:
    1. Start with a warm greeting (e.g., "Good morning, here is your personalized briefing").
    2. Transition smoothly between articles.
    3. Keep it engaging and avoid overly technical jargon unless requested.
    4. End with a short wrap-up.
    5. Length should be around 2-3 minutes of speaking time (300-500 words).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || "Sorry, I couldn't generate a summary.";
}

export async function generateTTS(text: string, voiceName: string): Promise<AudioBuffer> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to generate audio data");
  }

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioData = decodeBase64(base64Audio);
  return await decodeAudioData(audioData, audioContext, 24000, 1);
}
