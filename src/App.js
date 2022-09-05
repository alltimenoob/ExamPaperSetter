
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenCourse from './components/OpenCourse';
import NewCourse from './components/NewCourse';
import EditCourse from './components/EditCourse';
import WelcomeTour from './components/WelcomeTour';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/updateCourse" element={<EditCourse />}/>
        <Route  path='/' element={<OpenCourse/>}/>
        <Route path='/createCourse' element={<NewCourse />} />
        <Route index path="/WelcomeTour" element={<WelcomeTour />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
