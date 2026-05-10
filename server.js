require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Analyze this Reddit content:

"${text}"

Return ONLY JSON:

{
  "category":"spam | toxic | safe",
  "confidence":0-100,
  "reason":"short reason"
}
`,
        },
      ],
      temperature: 0.2,
    });

    const result = response.choices?.[0]?.message?.content;

    res.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI analysis failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("AI Mod Backend Running");
});

app.get("/test-ai", async (req, res) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Is 'FREE MONEY CLICK NOW' spam?",
        },
      ],
    });

    res.json({
      success: true,
      result: response.choices?.[0]?.message?.content,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});