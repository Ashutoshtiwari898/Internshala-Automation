require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "Write a story about a magic backpack.";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
}
run();
