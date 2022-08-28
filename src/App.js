import TitleBar from './components/TitleBar';
import Drawer from './components/Drawer';
import './App.css';
import { AiOutlineFileAdd,AiOutlineFolderOpen } from 'react-icons/ai'
import {VscChromeMinimize ,VscChromeMaximize , VscChromeClose} from 'react-icons/vsc'

function App() {

  const setSubject = async() =>
  {
    
  }

  const items = [AiOutlineFileAdd,AiOutlineFolderOpen] 
  /* List Of Icons For Drawer */

  const drawers= [
     <div className="h-screen flex flex-col items-center justify-evenly">
        <input type="text" placeholder='Course Name'/>
        <button onClick={setSubject} className="pl-3 pt-1 pr-3 pb-1 rounded bg-primary">Click</button>
     </div>
  ]
  /* List Of Functionality For Drawers */

  return (
    <div className="App">
      {/* TitleBar Containing Name , Minimize, Maximize, Close*/}
      <TitleBar name="Exam Paper" min={VscChromeMinimize} close={VscChromeClose} max={VscChromeMaximize}></TitleBar>

      {/* Left Aligned Functionality(drawers) Navigator With Icons(items) */}
      <Drawer items={items} drawers={drawers}/>
    </div>
  );
}

export default App;