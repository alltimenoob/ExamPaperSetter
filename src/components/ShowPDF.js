
import React, { useEffect, useState } from 'react';
import TitleBar from './TitleBar';
import {IoArrowBackCircleOutline} from "react-icons/io5"
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';


export default function ShowPDF(){

  const [file,setFile] = useState(null)

  useEffect(()=>{
    window.api.getFile().then((value)=>{
      setFile("data:application/pdf;base64,"+value)
      console.log("data:application/pdf;base64,"+value)
    })
  },[])

  return (
    <div className='App'> 

      <TitleBar name="PDF" close={true} max={true} min={true}  window="CourseWindow"></TitleBar>

      <IoArrowBackCircleOutline className="mt-8 w-9 h-9 text-white ml-1 mr-1"
            onClick={()=>{
                window.api.goBack()
            }} />
            
      {file && <div className="mt-8 flex items-center justify-center w-full h-full bg-white" >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
          <div  className="w-[800px] min-h-screen overflow-y-scroll">
          <Viewer fileUrl={file} />;
          </div>
          
        </Worker>
      </div> }
    </div>
  );
}

