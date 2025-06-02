import { GoogleGenerativeAI } from '@google/generative-ai';

// This assumes you have set the GEMINI_API_KEY environment variable before running the application
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateText(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
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