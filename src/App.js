
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenCourse from './components/OpenCourse';
import NewCourse from './components/NewCourse';
import EditCourse from './components/EditCourse';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/updateCourse" element={<EditCourse />}/>
        <Route index path='/' element={<OpenCourse/>}/>
        <Route path='/createCourse' element={<NewCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
