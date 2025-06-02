import { GoogleGenAI } from '@google/genai';

// This assumes you have set the GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const tools = [
  { googleSearch: {} },
];
const config = {
  tools,
  responseMimeType: 'text/plain',
};
const model = 'gemini-2.5-flash-preview-05-20';

export async function getResponseFromModel(prompt: string): Promise<string> {
  try {
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];
    const result = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let response = '';
    for await (const chunk of result) {
      response += chunk.text;
    }
    return response;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw new Error('Failed to generate text with Gemini');
  }
}

// Example usage (can be integrated into your message handling logic)
// async function handleMessage(messageText: string): Promise<string> {
//   const geminiResponse = await generateText(`Respond to the following message: "${messageText}"`);
//   return geminiResponse;
// }