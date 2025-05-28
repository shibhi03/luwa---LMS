const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const cors = require("cors");
const { json } = require("stream/consumers");

const port = 6969;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

require("dotenv").config();

app.use(cors(corsOptions));
app.use(express.json());

const API_KEY = process.env.GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Course details
app.use("/img", express.static(path.join(__dirname, "assets/img")));

app.get("/luwa/api/courses", (req, res) => {
  const courses = require("./assets/courses.json");
  res.json(courses);
});

// Multiple choice questions
app.post("/luwa/api/mcqs", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });

    const language1 = req.body.lang1;
    const language2 = req.body.lang2;

    if (!language1 || !language2) {
      return res
        .status(400)
        .json({ error: "Both language codes are required." });
    }

    const prompt = `Generate 15 multiple choice questions to test the knowledge of a person in ${language2} concepts that are also covered in ${language1}, without mentioning ${language1}. Provide 5 questions for each difficulty level: easy, medium, and hard. For each question, include the question text, a list of answer options, the correct answer, the difficulty level (easy, medium, or hard), and the concepts covered. Format the output as a JSON array of question objects, where each object has the following structure: { "question": "...", "options": ["...", "..."], "answer": "...", "level": "...", concepts: ["..."] }.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    let jsonString = generatedText.trim();

    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    try {
      const questions = JSON.parse(jsonString);

      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }

      // Basic validation of question structure
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.options || !q.answer || !q.level) {
          throw new Error(`Question ${i + 1} is missing required fields`);
        }
        if (!Array.isArray(q.options)) {
          throw new Error(`Question ${i + 1} options is not an array`);
        }
      }

      res.status(200).json(questions);
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError.message);
      return res
        .status(500)
        .json({
          error:
            "Failed to parse generated questions. The AI did not return a valid JSON format.",
          rawResponse: generatedText,
        });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch the questions" });
  }
});

// Calculate PPS
/*
Programming Profficiency Score (PPS) = (WCS * 0.5) + (AC * 0.3) + (CD * 0.2)
  -> Weighted Correct Score (WCS) = sum(cQdi * wi), i = [1, 2, 3]
        cQdi = Number of correct answers in each difficulty level
        wi = difficulty level weight
  -> Accuracy (AC) = cA / tQ;
        cA = Number of correct answers
        tQ = Total attempts
  -> Concept Diversity (CD) = aC / tC;
        aC = Number of unique concept attempted
        tC = Total number of concepts
*/
app.post("/luwa/api/calculatePPS", (req, res) => {
  const score = req.body.score;
  console.log("Score:", score);
  const difficultyWeights = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const actualPPS = 15.5;

  try {
    // WCS
    let WCS = 0;
    for (let level in score.correct) {
      WCS += (score.correct[level] || 0) * (difficultyWeights[level] || 0);
    }

    // AC
    const totalCorrect = Object.values(score.correct).reduce((a, b) => a + b, 0);
    const totalAttempts = Object.values(score.attended).reduce(
      (a, b) => a + b,
      0
    );
    const AC = totalCorrect / totalAttempts;

    // LD
    const uniqueLevels = Object
      .keys(score.attended)
      .filter((level) => score.attended[level] > 0)
      .length;
    const CD = uniqueLevels / Object.keys(score.correct).length;

    // PPS
    const PPS = ((WCS * 0.5) + (AC * 0.3) + (CD * 0.2));

    const PPSpercent = (PPS / actualPPS) * 100;

    res.status(200).json({
      PPS: PPSpercent.toFixed(2),
      WCS: WCS,
      AC: AC.toFixed(2),
      LD: CD.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" + error });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
