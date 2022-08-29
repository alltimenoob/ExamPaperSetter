import { useState, useEffect } from "react"
import TitleBar from "./TitleBar"
import {AiFillPlusCircle} from "react-icons/ai"

function NewCourse()
{
    const [course_name,setCourseName] = useState("")
    const [course_code,setCourseCode] = useState("")
	const [page,setPage] =  useState("Course")
	const [NumberOfCO,setNumberOfCO] = useState(1);

    const createCourse = async (args) =>{
        if(args!=null)
        {
            const result = await window.api.getCourses()
            console.log(result)
            //if(result)
                //window.api.close("NewCourseWindow")
        }
    }
   
	const [COFields,setCOFields] = useState([])
	const [COFieldsValues,setCOFieldsValues] = useState([])

	useEffect(()=>{
		setCOFields([])

		let temp = []
		for(let i = 1 ; i <= NumberOfCO ; i++)
		{
			temp.push( 
			<input type="text" 
			className='TextBox mb-2 w-full' 
			value={COFieldsValues[i]} 
			onChange={(event)=>{
				let values = COFieldsValues
				values[i] = event.target.value
				setCOFieldsValues(values)}
			}
			placeholder={'Course Outcome '+i} />)
		}	

		setCOFields(temp)
			
	},[NumberOfCO])

	return(
    <div className="App">
					
        <TitleBar close={true} max={false} min={false} window="NewCourseWindow"></TitleBar>

        <div className="h-screen w-screen mt-8 bg-white flex justify-center items-start ">
		{(page == "Course") && <div className="grid grid-flow-row items-center mt-20 justify-center gap-4">
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
        
		{/*    <button className="Button" onClick={()=>
			{
				if(course_name!=""&&course_code!="")
				createCourse({"course_name":course_name,"course_code":course_code})}
			}>Create</button>
         */}
			<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
		onClick={()=>{ } }>Cancel</button>

			<button className="absolute bottom-5 right-[140px] Button w-[100px] " onClick={
			()=> { setPage("CO") } }>Next</button> 
	 </div>}
		{ (page == "CO") && <div className="grid grid-flow-row items-center mt-1 justify-center gap-2 p-2">
        <span className='select-none text-[20px]'>Create Course Outcomes</span>
		<div className="overflow-y-scroll w-screen min-h-[250px] max-h-[250px] p-6 ">
				{COFields}
			<AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
			onClick={
				()=>{
					setNumberOfCO(NumberOfCO+1)
				}
			}/>
		</div>

		{/*    <button className="Button" onClick={()=>
			{
				if(course_name!=""&&course_code!="")
				createCourse({"course_name":course_name,"course_code":course_code})}
			}>Create</button>
         */}
			<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
		onClick={()=>{ } }>Cancel</button>

			<button className="absolute bottom-5 right-[140px] Button w-[100px] ">Next</button> 
	 </div>}
        </div> 
    </div>
    )
}

export default NewCourse
