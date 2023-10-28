import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import OpenCourse from "./pages/OpenCourse";
import NewCourse from "./pages/NewCourse";
import EditCourse from "./pages/EditCourse";
import CourseHome from "./pages/CourseHome";
import WelcomeTour from "./pages/WelcomeTour";
import AddQuestion from "./pages/AddQuestion";
import GeneratePaper from "./pages/GeneratePaper";
import ManageQuestion from "./pages/ManageQuestions";
import ModifyQuestion from "./pages/ModifyQuestion";
import ManageUnits from "./pages/ManageUnits";
import ManageCourseOutcomes from "./pages/ManageCourseOutcomes";
import { useEffect } from "react";

function App() {
  useEffect(()=>{
    const script = document.createElement('script');

    script.src = new URL('./assets/promise.js', import.meta.url).href
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  })
  return (
    <HashRouter >
      <Routes>
        <Route path="/" element={<OpenCourse />} />
        <Route path="/WelcomeTour" element={<WelcomeTour />} />
        <Route path="/AddQuestion" element={<AddQuestion />} />
        <Route path="/GeneratePaper" element={<GeneratePaper />} />
        <Route path="/ManageQuestions" element={<ManageQuestion />} />
        <Route path="/ModifyQuestion" element={<ModifyQuestion />} />
        <Route path="/updateCourse" element={<EditCourse />} />
        <Route path="/createCourse" element={<NewCourse />} />
        <Route path="/CourseHome" element={<CourseHome />} />
        <Route path="/ManageUnits" element={<ManageUnits />} />
        <Route path="/ManageCourseOutcomes" element={<ManageCourseOutcomes />} />
      </Routes>
    </HashRouter >
  );
}

export default App;
