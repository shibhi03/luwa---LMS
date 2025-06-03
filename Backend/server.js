const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const cors = require("cors");
const { json } = require("stream/consumers");

const port = 6969;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // access-control-allow-credentials:true
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

    console.log("Generating Questions...");

    const prompt = `Generate multiple choice questions to test the knowledge of a person in ${language2} concepts that are also covered in ${language1}, without mentioning ${language1}.

Provide exactly 5 questions for each of these programming concepts:
1. Variables and Data Types
2. Control Flow (Conditional Statements) 
3. Control Flow (Loops)
4. Functions
5. Lists and Arrays

For each question, include:
- A "question number" (starting from "1" for each concept)
- The "question" text (including code snippets if relevant, with newlines escaped as \\n)
- A list of "options" (an array of strings)
- The "answer" (the correct option string)
- The "level" of difficulty ("easy", "medium", or "hard")

**CRITICAL: The output MUST be a JSON object where each key is exactly one of the concept names listed above, and each value is an array of exactly 5 question objects.**

**Do NOT wrap the JSON in markdown code blocks. Return only the raw JSON object.**

**Required structure:**
{
  "Variables and Data Types": [
    {
      "question number": "1",
      "question": "example question text",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "option1",
      "level": "easy"
    }
    // ... 4 more questions
  ],
  "Control Flow (Conditional Statements)": [
    // ... 5 questions
  ],
  "Control Flow (Loops)": [
    // ... 5 questions  
  ],
  "Functions": [
    // ... 5 questions
  ],
  "Lists and Arrays": [
    // ... 5 questions
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text(); // Use 'let' because we modify it
    console.log("Questions generated");
    console.log("Response:", generatedText);

    // Remove markdown code block fences if present
    if (generatedText.startsWith("```json")) {
      generatedText = generatedText.slice(7, -3).trim(); // Remove '```json' and '```'
    } else if (generatedText.startsWith("```")) {
      generatedText = generatedText.slice(3, -3).trim(); // Remove '```'
    }

    try {
      const parsedText = JSON.parse(generatedText);

      // Validate that the parsed result is an object
      if (typeof parsedText !== 'object' || parsedText === null) {
        throw new Error("AI response is not a valid JSON object.");
      }

      res.status(200).json(parsedText);

    } catch (parseError) {
      console.error("Error parsing or validating AI response JSON:", parseError.message);
      return res.status(500).json({
        error:
          "Failed to parse or validate generated questions. The AI did not return a valid JSON format or structure.",
        rawResponse: generatedText, // Include raw response for debugging
      });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch the questions" });
  }
});

app.post("/luwa/api/learning-path", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    console.log(req.body);
    const scores = req.body.score;
    const analysis = req.body.analysis;
    const language1 = req.body.lang1;
    const language2 = req.body.lang2;

    const prompt = `
  Create adaptive ${language1} course plan using ${language2} knowledge. Prioritize weak areas from: ${scores}, ${analysis}. 

Structure: beginner/intermediate/advanced topics + detailed study_plan. Include hours, format, difficulty.

Return JSON:
{
  "beginner": ["topic1", "topic2"],
  "intermediate": ["topic3", "topic4"], 
  "advanced": ["topic5", "topic6"],
  "study_plan": [
    {
      "topic": "topic1",
      "difficulty": "easy", 
      "estimated_time_hours": 2,
      "format": "videos/exercises/projects"
    }
  ]
}
  `;

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout after 30s")), 30000)
      ),
    ]);
    const response = await result.response;
    const generatedText = response.text();

    let jsonString = generatedText.trim();
    const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);

    let parsedJson;
    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedJson = JSON.parse(jsonMatch[1]);
      } catch (parseError) {
        console.error("Error parsing AI response as JSON:", parseError.message);
        return res.status(500).json({
          error:
            "Failed to parse generated questions. The AI did not return a valid JSON format.",
          rawResponse: generatedText,
        });
      }
    } else {
      console.log("smthng is wrong bruhhh!!!");
    }
    console.log(parsedJson);
    res.json(parsedJson);
  } catch (error) {
    console.error("Error generating content: ", error);
    res
      .status(500)
      .json({ error: "Failed to generate content " + error.message });
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
app.post("/luwa/api/calculatePPS", async (req, res) => {
  const score = req.body.score;
  console.log("Score:", score);
  const difficultyWeights = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const actualPPS = 15.5;
  const actualWCS = 30;

  try {
    // WCS
    let WCS = 0;
    for (let level in score.correct) {
      WCS += (score.correct[level] || 0) * (difficultyWeights[level] || 0);
    }

    // AC
    const totalCorrect = Object.values(score.correct).reduce(
      (a, b) => a + b,
      0
    );
    const totalAttempts = Object.values(score.attended).reduce(
      (a, b) => a + b,
      0
    );
    const AC = totalCorrect / totalAttempts;

    // LD
    const uniqueLevels = Object.keys(score.attended).filter(
      (level) => score.attended[level] > 0
    ).length;
    const CD = uniqueLevels / Object.keys(score.correct).length;

    // PPS
    const PPS = WCS * 0.5 + AC * 0.3 + CD * 0.2;

    const PPSpercent = (PPS / actualPPS) * 100;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    let insights;
    try {
      const prompt = `
      Generate Insight for the student's performance and the areas he/she is good in using the following data:
      Programming proficiency score(PPS): ${PPSpercent.toFixed(2)}%
      Weighted Course Score(WCS): ${WCS.toFixed(2)}
      Weighted Course Ratio(WSR): ${((WCS / actualWCS) * 100).toFixed(2)}%
      Accuracy(AC): ${AC.toFixed(2)}
      conceptual divesity(CD): ${CD.toFixed(2)}
      Score: ${score}.
      Format the output as a JSON array of insight objects, where each object a insight.
      Give only the data in JSON format without any additional text.
      `;

      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout after 30s")), 30000)
        ),
      ]);

      const response = await result.response;
      const generatedText = response.text();

      let jsonString = generatedText.trim();
      const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          insights = JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error(
            "Error parsing AI response as JSON:",
            parseError.message
          );
          return res.status(500).json({
            error:
              "Failed to parse generated questions. The AI did not return a valid JSON format.",
            rawResponse: generatedText,
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" + error });
    }

    res.status(200).json({
      PPS: PPSpercent.toFixed(2),
      WCS: WCS,
      WCR: (WCS / actualWCS).toFixed(2),
      AC: AC.toFixed(2),
      CD: CD.toFixed(2),
      Insights: insights,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" + error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
