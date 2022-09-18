import { useEffect, useState } from "react";
import TitleBar from "./TitleBar";

import {IoArrowBackCircleOutline} from "react-icons/io5"


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

        <IoArrowBackCircleOutline className="mt-8 w-9 h-9 text-white ml-1 mr-1"
            onClick={()=>{
                window.api.goBack()
            }} />
        <div className='mt-8 w-screen h-screen bg-white flex items-start'>
            <div className="grid gap-1 grid-flow-row grid-cols-1 m-5">
                
                <div className="w-[100px] h-[100px]  hover:opacity-75 cursor-pointer
                 bg-primary rounded flex items-center justify-center text-white"
                 onClick={()=>{
                    window.api.openGenereatePaper(url.get("course_id"))
                 }}>
                    <span className="text-lg text-center">New Exam Paper </span>
                </div>
                
                <div className="w-[100px] h-[100px] hover:opacity-75 cursor-pointer
                 bg-primary rounded flex items-center justify-center text-white"
                 onClick={()=>{
                    window.api.openAddQuestions(url.get("course_id"))
                 }}>
                    <span className="text-lg text-center">Add Questions </span>
                </div>
           
                <div className="w-[100px] h-[100px] hover:opacity-75 cursor-pointer
                 bg-primary rounded flex items-center justify-center text-white">
                    <span className="text-lg text-center">Manage Questions </span>
                </div>
            
                <div className="w-[100px] h-[100px] hover:opacity-75 cursor-pointer
                 bg-primary rounded flex items-center justify-center text-white">
                    <span className="text-lg text-center">Manage COs </span>
                </div>

                <div className="w-[100px] h-[100px] hover:opacity-75 cursor-pointer
                 bg-primary rounded flex items-center justify-center text-white">
                    <span className="text-lg text-center">Manage Units </span>
                </div>
            </div>
            <div className="m-5 flex flex-col gap-2 w-full items-center justify-center ">
                <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">Old Papers #1</span>
                <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">Old Papers #2</span>
                <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">Old Papers #3</span>
            </div>
        </div>
    </div>)


}