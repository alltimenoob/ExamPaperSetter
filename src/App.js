import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenCourse from './pages/OpenCourse';
import NewCourse from './pages/NewCourse';
import EditCourse from './pages/EditCourse';
import Course from './pages/Course';
import WelcomeTour from './pages/WelcomeTour';
import AddQuestion from './pages/AddQuestion';
import GeneratePaper from './pages/GeneratePaper';
import ManageQuestion from './pages/ManageQuestion';
import ModifyQuestion from './pages/ModifyQuestion';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/WelcomeTour' element={<WelcomeTour/>} />
        <Route path="/AddQuestions" element={<AddQuestion />}/>
        <Route path='/GeneratePaper' element={<GeneratePaper/>} />
        <Route path='/ManageQuestion' element={<ManageQuestion/>} />
        <Route path='/ModifyQuestion' element={<ModifyQuestion />} />
        <Route path="/updateCourse" element={<EditCourse />}/>
        <Route path='/' element={<OpenCourse/>}/>
        <Route path='/createCourse' element={<NewCourse />} />
        <Route path='/course' element={<Course />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
