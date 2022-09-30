
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenCourse from './components/OpenCourse';
import NewCourse from './components/NewCourse';
import EditCourse from './components/EditCourse';
import Course from './components/Course';
import WelcomeTour from './components/WelcomeTour';
import AddQuestion from './components/AddQuestion';
import GeneratePaper from './components/GeneratePaper';

function App() {


  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/WelcomeTour' element={<WelcomeTour/>} />
        <Route path="/AddQuestions" element={<AddQuestion />}/>
        <Route path='/GeneratePaper' element={<GeneratePaper/>} />
        <Route path="/updateCourse" element={<EditCourse />}/>
        <Route path='/' element={<OpenCourse/>}/>
        <Route path='/createCourse' element={<NewCourse />} />
        <Route path='/course' element={<Course />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
