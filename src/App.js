import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenCourse from "./pages/OpenCourse";
import NewCourse from "./pages/NewCourse";
import EditCourse from "./pages/EditCourse";
import Course from "./pages/Course";
import WelcomeTour from "./pages/WelcomeTour";
import AddQuestion from "./pages/AddQuestion";
import GeneratePaper from "./pages/GeneratePaper";
import ManageQuestion from "./pages/ManageQuestions";
import ModifyQuestion from "./pages/ModifyQuestion";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<OpenCourse />} />
        <Route path="/WelcomeTour" element={<WelcomeTour />} />
        <Route path="/AddQuestion" element={<AddQuestion />} />
        <Route path="/GeneratePaper" element={<GeneratePaper />} />
        <Route path="/ManageQuestions" element={<ManageQuestion />} />
        <Route path="/ModifyQuestion" element={<ModifyQuestion />} />
        <Route path="/updateCourse" element={<EditCourse />} />
        <Route path="/createCourse" element={<NewCourse />} />
        <Route path="/Course" element={<Course />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
