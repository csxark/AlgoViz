
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize the Google Generative AI client with API key from environment
const ai = new GoogleGenerativeAI(process.env.API_KEY);

// Tool definition for Gemini to interact with the visualizer
const highlightTool = {
  name: 'highlightNode',
  description: 'Highlight a specific node value in the visualization to explain a concept.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      value: {
        type: SchemaType.NUMBER,
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
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: `You are a helpful AI assistant. Answer user queries clearly and accurately. If the context involves algorithms or visualizations, provide educational explanations. Keep responses concise and informative.`,
      tools: context.includes('visualizer') ? [{ functionDeclarations: [highlightTool] }] : [],
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage(newMessage);
    const response = result.response;
    
    const functionCalls = response.functionCalls();
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

    return response.text() || "I'm here to help!";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const analyzeStructureImage = async (base64Image: string): Promise<number[] | null> => {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      { text: "Analyze structure. Return ONLY a JSON array of found values in insertion order. Example: [10,20,30]. Return [] if none." },
      { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
    ]);
    const response = result.response;
    const text = response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Vision Error:", error);
    return null;
  }
};
