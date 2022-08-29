import { useState } from "react"
import TitleBar from "./TitleBar"

function NewCourse()
{
    const [course_name,setCourseName] = useState("")
    const [course_code,setCourseCode] = useState("")

    const createCourse = async (args) =>{
        if(args!=null)
        {
            const result = await window.api.getCourses()
            console.log(result)
            //if(result)
                //window.api.close("NewCourseWindow")
        }
    }
    
    return(
    <div className="App">
        
        <TitleBar close={true} max={false} min={false} window="NewCourseWindow"></TitleBar>

        <div className="h-screen w-screen mt-8 bg-white flex justify-center items-start ">
        <div className="grid grid-flow-row items-center mt-20 justify-center gap-2">
        <span className='select-none text-[20px]'>Create New Course</span>
        
        <input type="text" 
        className='TextBox' 
        value={course_name} 
        onChange={(event)=>setCourseName(event.target.value)}
        placeholder='Course Name'/>

        <input type="text" 
        className='TextBox' 
        value={course_code} 
        onChange={(event)=>setCourseCode(event.target.value)}
        placeholder='Course Code'/>
        
        
        <button className="Button" onClick={()=>createCourse(
            {
                "course_name":course_name,
                "course_code":course_code
            }
            )
            }>Create</button>
        
        </div>
        
        </div>
    </div>
    )
}

export default NewCourse