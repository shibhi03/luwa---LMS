import Analysis from "../Analysis";
import CourseRegister from "../courseRegister/CourseRegister";
import Course from "../courseRegister/Courses";
import KnownDomain from "../courseRegister/KnownDomain";
import SignupForm from "../courseRegister/SignupForm";
import TakeTest from "../courseRegister/Test/TakeTest";
import TestPage from "../courseRegister/Test/TestPage";
import Home from "../Home";
import Login from "../Login";

export const routes = [
  { id: "home", path: "/", component: Home },
  { id: "signup", path: "/signup", component: SignupForm },
  { id: "CourseRegister", path: "/signup/CourseRegister", component: CourseRegister },
  { id: "courses", path: "/signup/CourseRegister/courses", component: Course },
  { id: "known-domain", path: "/signup/CourseRegister/knownDomain", component: KnownDomain },
  { id: "takeTest", path: "/takeTest", component: TakeTest },
  { id: "questions", path: "/takeTest/questions", component: TestPage },
  { id: "analysis", path: "/analysis", component: Analysis },
  { id: "login", path: "/login", component: Login },
];
