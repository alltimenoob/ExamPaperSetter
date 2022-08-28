
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OpenCourse from './components/OpenCourse';
import NewCourse from './components/NewCourse';

function App() {


 
 /* 
  const items = [AiOutlineFileAdd,AiOutlineFolderOpen] 
  List Of Icons For Drawer 

  const drawers= [
    
    
  ] 

*/

/* List Of Functionality For Drawers */

  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<OpenCourse/>}/>
        <Route path='/createCourse' element={<NewCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;