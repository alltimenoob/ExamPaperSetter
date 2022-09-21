import React, { useEffect, useState } from 'react';
import TitleBar from './TitleBar';
import {IoArrowBackCircleOutline} from "react-icons/io5"
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';



export default function ShowPDF(){

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const [file,setFile] = useState(null)

  useEffect(()=>{
    window.api.getFile().then((value)=>{
      setFile("data:application/pdf;base64,"+value)
    })
  },[])

  return (
    <div className='App'> 

      <TitleBar name="PDF" close={true} max={true} min={true}  window="CourseWindow"></TitleBar>

      <IoArrowBackCircleOutline className="mt-8 w-9 h-9 text-white ml-1 mr-1"
            onClick={()=>{
                window.api.goBack()
            }} />
            
      {file && <div className="left-10 top-8 absolute flex items-center justify-center w-screen h-full bg-white" >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
          <div  className=" w-full  max-w-[800px] border-2 h-full overflow-y-scroll">
          <Viewer fileUrl={file} plugins={[pageNavigationPluginInstance]}/>;
          </div>
        </Worker>
        <button className='fixed bottom-5 right-7 Button w-[150px]'
        onClick={()=>{
          window.api.saveFile(file)
        }}
        > Save </button>
      </div> }
    </div>
  );
}

