const express = require("express");
const path = require("path");
const cors = require("cors");
const port = 6969;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/luwa/api/questions", (req, res) => {
  const questions = require("./assets/questions.json");
  res.json(questions);
});

app.use("/img", express.static(path.join(__dirname, "assets/img")));

app.get("/luwa/api/courses", (req, res) => {
  const courses = require("./assets/courses.json");
  res.json(courses);
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
