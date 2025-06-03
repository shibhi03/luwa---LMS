import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDataStore } from "./orchestrationService/DataStore";
import Loader from "../commonComponents/Loader";

const useDataStores = () => {
  const [mockData] = useState({
    score: 75,
    analysis: { PPS: 80, WCS: 90, AC: 85, CD: 'High', Insights: [{area: "Pointers", insight: "Needs improvement in pointer arithmetic."}] },
    language1: "Java",
    language2: "C++",
  });

  const getData = (key) => {
    return mockData[key];
  };

  return { getData };
};

export default function LearningPathDisplay() {
  const { getData } = useDataStores();

  const [learningData, setLearningData] = useState(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Correctly get data from the store
  const scores = getData("score");
  const analysis = getData("analysis");
  const language1 = getData("language1");
  const language2 = getData("language2");

  useEffect(() => {
    // Ensure all required data is available before making the API call
    if (scores === undefined || analysis === undefined || language1 === undefined || language2 === undefined) {
      // If data is not yet available, don't attempt to fetch.
      // This might happen if getData is async or not yet populated.
      // For this mock, it's synchronous, but good practice for real scenarios.
      setIsLoading(false); // Or handle as appropriate
      setError("Required data for fetching learning path is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Mocking axios.post
    const mockApiCall = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulating a successful API response
        if (language1 === "Java" && language2 === "C++") { // Example condition
          resolve({
            data: {
              study_plan: [
                {
                  topic: "Introduction to C++ Syntax & Basic I/O",
                  difficulty: "easy",
                  estimated_time_hours: 3,
                  format: "Reading / Video / Hands-on Exercises",
                },
                {
                  topic: "Pointers and Memory Management in C++",
                  difficulty: "hard",
                  estimated_time_hours: 8,
                  format: "In-depth Reading / Coding Challenges / Pair Programming",
                },
                {
                  topic: "Object-Oriented Programming (OOP) in C++ vs Java",
                  difficulty: "medium",
                  estimated_time_hours: 6,
                  format: "Comparative Study / Project Work / Quizzes",
                },
                {
                  topic: "Standard Template Library (STL) - Containers & Algorithms",
                  difficulty: "medium",
                  estimated_time_hours: 7,
                  format: "Documentation Review / Practical Examples / Mini-Project",
                },
                 {
                  topic: "Exception Handling in C++",
                  difficulty: "easy",
                  estimated_time_hours: 2,
                  format: "Tutorials / Code Snippets / Debugging Practice",
                },
              ],
            },
          });
        } else {
          // Simulating an API error
          reject(new Error("Failed to fetch learning path for the given languages."));
        }
      }, 1500); // Simulate network delay
    });

    mockApiCall
      .then((response) => {
        setLearningData(response.data);
      })
      .catch((err) => {
        console.error("Error getting learning path: " + err.message);
        setError("Error getting learning path: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Real axios call would look like this:
    /*
    axios
      .post("http://localhost:6969/luwa/api/learning-path", {
        score: scores,
        analysis: analysis,
        lang1: language1,
        lang2: language2,
      })
      .then((response) => {
        setLearningData(response.data);
      })
      .catch((error) => {
        console.error("Error getting learning path" + error);
        setError("Error getting learning path. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    */
  }, [scores, analysis, language1, language2]); // Dependencies for useEffect

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "🟢";
      case "medium":
        return "🟡";
      case "hard":
        return "�";
      default:
        return "⚪";
    }
  };

  // Calculate totalHours only if data is available
  const totalHours =
    learningData?.study_plan?.reduce(
      (sum, item) => sum + item.estimated_time_hours,
      0
    ) || 0;

  if (isLoading) {
    return <Loader text="Generating Your Learning Path..." />;
  }

  if (error) {
    return (
      <Container className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong.</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              // Trigger useEffect again by slightly changing a dependency or having a dedicated retry function
              // For simplicity, we're just resetting state here. A real retry might re-fetch.
              // This is a bit of a hack for this example; a better way is to have a retry function that re-runs the effect's logic.
              // For now, we'll rely on the effect re-running if dependencies change, or user navigates away and back.
               window.location.reload(); // Simplest way to retry in this context
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  if (!learningData || !learningData.study_plan || learningData.study_plan.length === 0) {
    return (
      <Container className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Learning Path Available</h2>
            <p className="text-gray-600">We couldn't generate a learning path with the provided information.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 ring-1 ring-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          {language2} Learning Path
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          A comprehensive study plan transitioning from {language1} to {language2}.
        </p>
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
          <div className="bg-blue-100 px-4 py-2 rounded-full shadow-sm">
            <span className="font-semibold text-blue-800">
              Total Topics: {learningData.study_plan.length}
            </span>
          </div>
          <div className="bg-purple-100 px-4 py-2 rounded-full shadow-sm">
            <span className="font-semibold text-purple-800">
              Total Hours: {totalHours}h
            </span>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-full shadow-sm">
            <span className="font-semibold text-green-800">
              Est. Duration: {totalHours > 0 ? Math.ceil(totalHours / 10) : 0} weeks (at 10h/week)
            </span>
          </div>
        </div>
      </div>

      {/* Study Plan Cards */}
      <div className="space-y-6">
        {learningData.study_plan.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ring-1 ring-gray-100"
          >
            <div className="p-5 sm:p-6">
              {/* Header with sequence number and difficulty */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-base shadow-md">
                    {index + 1}
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${getDifficultyColor(
                      item.difficulty
                    )}`}
                  >
                    <span>{getDifficultyIcon(item.difficulty)}</span>
                    {item.difficulty?.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">
                    {item.estimated_time_hours}h
                  </span>
                </div>
              </div>

              {/* Topic Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                {item.topic}
              </h3>

              {/* Format Tags */}
              <div className="flex flex-wrap gap-2">
                {item.format?.split("/").map((format, formatIndex) => (
                  <span
                    key={formatIndex}
                    className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium"
                  >
                    {format.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Bar (visual indicator of sequence) */}
            <div className="h-1.5 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-r-full"
                style={{
                  width: `${
                    ((index + 1) / learningData.study_plan.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {["easy", "medium", "hard"].map((diff) => {
          const count =
            learningData.study_plan.filter(
              (item) => item.difficulty === diff
            ).length;
          const hours = learningData.study_plan
            .filter((item) => item.difficulty === diff)
            .reduce((sum, item) => sum + item.estimated_time_hours, 0);
          
          let textColor = "text-green-600";
          if (diff === "medium") textColor = "text-yellow-600";
          if (diff === "hard") textColor = "text-red-600";

          return (
            <div key={diff} className="bg-white rounded-xl shadow-lg p-6 text-center ring-1 ring-gray-100">
              <div className={`text-3xl font-bold ${textColor} mb-2`}>
                {count}
              </div>
              <div className="text-gray-700 font-semibold capitalize">{diff} Topics</div>
              <div className="text-sm text-gray-500 mt-1">
                {hours}h total
              </div>
            </div>
          );
        })}
      </div>
       <footer className="text-center py-8 mt-8 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Personalized Learning Path. All rights reserved.</p>
      </footer>
    </div>
  );
};