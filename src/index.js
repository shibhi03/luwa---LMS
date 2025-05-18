import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Components/Home';
import Login from './Components/Login';
import reportWebVitals from './reportWebVitals';
import Course from './Components/courseRegister/Courses';
import KnownDomain from './Components/courseRegister/KnownDomain';
import TakeTest from './Components/courseRegister/TakeTest';
import TestPage from './Components/courseRegister/TestPage';
import Analysis from './Components/Analysis';
import SignupForm from "./Components/courseRegister/SignupForm";
import CourseRegister from "./Components/courseRegister/CourseRegister";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />}/>

      {/* Sign up */}
      <Route path="/signup" element={<SignupForm />}/>
      <Route path="/signup/CourseRegister" element={<CourseRegister />} />
      <Route path="/signup/CourseRegister/courses" element={<Course />} />
      <Route path="/signup/CourseRegister/known-domain" element={<KnownDomain />} />
      
      {/* Assessment */}
      <Route path="/takeTest" element={<TakeTest />} />
      <Route path="/takeTest/questions" element={<TestPage />} />

      <Route path="/analysis" element={<Analysis />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
