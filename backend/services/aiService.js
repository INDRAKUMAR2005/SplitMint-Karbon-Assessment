const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Lazy loading the clients to prevent crash on missing ENV variables during Vercel startup
let openai = null;
let genAI = null;

// You can use OpenAI or Gemini for MintSense logic. Here is OpenAI:
async function parseExpenseWithOpenAI(customText) {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  const prompt = `You are MintSense, an AI for a finance app. 
  Extract the following data from the natural language:
  - amount (Number)
  - description (String)
  - split_mode ('equal', 'custom', 'percentage')
  
  Text: "${customText}"
  
  Return ONLY a valid JSON object without markdown formatting.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini",
  });

  try {
    const rawContent = completion.choices[0].message.content;
    const jsonStr = rawContent.replace(/```json|```/g, ''); // cleanup any markdown 
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("MintSense parsing error:", error);
    return null;
  }
}

// Example with Gemini
async function parseExpenseWithGemini(customText) {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Convert this expense: "${customText}" to JSON with fields { amount, description, split_mode }. Return only raw JSON.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  text = text.replace(/```json|```/g, '');
  return JSON.parse(text);
}

module.exports = {
  parseExpenseWithOpenAI,
  parseExpenseWithGemini
};
