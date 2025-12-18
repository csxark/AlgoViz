
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

// Initialize the Google GenAI client with API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Tool definition for Gemini to interact with the visualizer
const highlightTool: FunctionDeclaration = {
  name: 'highlightNode',
  description: 'Highlight a specific node value in the visualization to explain a concept.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      value: {
        type: Type.NUMBER,
        description: 'The numeric value of the node to highlight.',
      },
    },
    required: ['value'],
  },
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const generateTutorResponse = async (
  history: ChatMessage[], 
  newMessage: string, 
  context: string,
  onHighlight?: (val: number) => void
): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are the ALGOVIZ CORE TUTOR. You must communicate in a high-fidelity, technical protocol style.
        
        STRICT FORMATTING RULES:
        1. All numbers, time complexities, and variable names MUST be wrapped in single dollar signs with ZERO internal spacing. 
           Example: Use $10$, not 10. Use $O(log_n)$, not O(log n). Use $root$, not root.
        2. Keep responses extremely compact. Do not use double newlines. Use single line breaks only if necessary.
        3. Maintain a "System Console" persona. Be precise, cold, but educational.
        4. Context: ${context}.
        5. If explaining a step, use the highlightNode tool for the relevant value.`,
        tools: [{ functionDeclarations: [highlightTool] }],
      }
    });

    for (const msg of history) {
      if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.text });
      }
    }

    const result = await chat.sendMessage({ message: newMessage });
    
    const functionCalls = result.functionCalls;
    if (functionCalls && functionCalls.length > 0 && onHighlight) {
      for (const call of functionCalls) {
        if (call.name === 'highlightNode') {
          const args = call.args as Record<string, unknown>;
          if (typeof args.value === 'number') {
             onHighlight(args.value);
          }
        }
      }
    }

    return result.text || "SYSTEM_IDLE";
  } catch (error) {
    console.error("AI Error:", error);
    return "PROTOCOL_ERROR: Connection to neural core lost.";
  }
};

export const analyzeStructureImage = async (base64Image: string): Promise<number[] | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze structure. Return ONLY a JSON array of found values in insertion order. Example: [10,20,30]. Return [] if none." }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Vision Error:", error);
    return null;
  }
};
