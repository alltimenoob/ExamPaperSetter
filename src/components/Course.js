import { useEffect, useState } from "react";
import TitleBar from "./TitleBar";

import {IoArrowBackCircleOutline,IoCreate,IoAddCircle,IoSettings} from "react-icons/io5"
import {BsFillPatchQuestionFill,BsInboxesFill} from "react-icons/bs"
import {GiWhiteBook} from "react-icons/gi"

export default function Course()
{
    const [Course,SetCourse] = useState({})
    const url = new URLSearchParams(window.location.search)

    useEffect( ()=>{
        
        async function getData(){
            const data =  await window.api.getCourseFromID(url.get("course_id")) 
            SetCourse(data)
        }
        getData()
    })

    return(
    <div className="App">
        <TitleBar name={Course.name} close={true} max={true} min={true} window="mainWindow"/>

        
        <div className='mt-8  w-screen  h-screen bg-white flex items-start'>
            <div className="h-screen w-[200px] bg-primary flex flex-col ">

            <div 
                className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
                onClick={()=>{
                    window.api.goBack()
                }}
            >
                <IoArrowBackCircleOutline className=" w-9 p-[1px] h-9 ml-1 mr-1"/>
                <span>Back</span>
            </div>   
            

            <div 
                className="mt-5 pt-2 pb-2 flex text-[12px] items-center justify-start text-white hover:bg-primaryDark"
                onClick={()=>{
                    window.api.openGenereatePaper(url.get("course_id"))
                }}
            >
                <IoCreate className="w-9 h-9  ml-1 mr-1" onClick={()=>{
                      window.api.openGenereatePaper(url.get("course_id"))
                    }} />
                <span>Generate Paper</span>
            </div> 
            
            <div 
                className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
                onClick={()=>{
                    window.api.openAddQuestions(url.get("course_id"))
                }}
            >
            
                <IoAddCircle className="w-9 h-9 text-white ml-1 mr-1" />
                <span>Add Questions</span>
            </div> 

            <div 
                className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
                onClick={()=>{
                    window.api.openGenereatePaper(url.get("course_id"))
                }}
            >
            
                <BsFillPatchQuestionFill className="w-9 h-9 p-[2px] text-white ml-1 mr-1" onClick={()=>{
                        window.api.openGenereatePaper(url.get("course_id"))
                    }} />
                
                <span>Manage Question</span>
            </div> 


            <div 
                className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
                onClick={()=>{
                    window.api.openGenereatePaper(url.get("course_id"))
                }}
            >
            
                <BsInboxesFill className="w-9 h-9 p-[4px] text-white ml-1 mr-1" onClick={()=>{
                    window.api.openGenereatePaper(url.get("course_id"))
                }} />

                <span>Manage Units</span>
            </div> 

            <div 
                className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
                onClick={()=>{
                    window.api.openGenereatePaper(url.get("course_id"))
                }}
            >
            
                <GiWhiteBook className="w-9 h-9 p-[2px] text-white ml-1 mr-1"  />
                        
                <span>Manage COs</span>
            </div> 
                
            </div>
            <div className="m-5  flex flex-col gap-2 w-full items-center justify-center ">
                <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">Old Papers #1</span>
                <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">Old Papers #2</span>
                <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">Old Papers #3</span>
            </div>
        </div>
    </div>)


}