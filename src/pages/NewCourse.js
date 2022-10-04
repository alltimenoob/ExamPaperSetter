import { useState } from "react"
import TitleBar from "../components/TitleBar"
import ContextMenu from "../components/ContextMenu"
import {AiFillPlusCircle} from "react-icons/ai"

function NewCourse()
{
    const [CourseName,setCourseName] = useState("")
    const [CourseCode,setCourseCode] = useState("")
	const [Page,setPage] =  useState("Course")
	
	const [CourseOutcomeList,setCourseOutcomeList] = useState([{"value":""}])
	const [UnitList,setUnitList] = useState([{"value":""}])

	const [SelectedTextBox,setSelectedTextBox] = useState(0)
	
	const TextBoxContextMenuItems = [
		<li className="flex justify-center text-primary items-center cursor-pointer hover:bg-primary/10 "
			key={0}
			onClick={()=>{
				
				if(Page==="CO")
				{
					let list = CourseOutcomeList.filter((_,i,__)=>{return i!==SelectedTextBox})
					setCourseOutcomeList(list)
				}
				else if(Page==="Unit")
				{
				
					let list = UnitList.filter((_,i,__)=>{return i!==SelectedTextBox})
					setUnitList(list)
				}
			}}>
			
			<span className="p-1 text-sm">Remove</span>
		</li>
	]

	const [x,setX] = useState(0)
	const [y,setY] = useState(0)

    const createCourse = async () =>{

        let output = {
			"name":CourseName,
			"code":CourseCode,
			"co":CourseOutcomeList,
			"unit":UnitList
		}
		const result = await window.api.createCourse(output)
		
		if(result)
            window.api.close("CourseWindow")
    
    }
 
	return(
    <div className="App" onClick={()=>{setX(0);setY(0)}}>
		<ContextMenu items={TextBoxContextMenuItems} x={x} y={y} ></ContextMenu>

        <TitleBar close={true} max={false} min={false} window="CourseWindow"></TitleBar>

        <div className="h-screen w-screen mt-8 bg-white flex justify-center items-start ">
		
			{(Page === "Course") && 
			<div className="grid grid-flow-row items-center mt-20 justify-center gap-4">
				
				<span className='select-none text-[20px]'>Add New Course</span>

				<input type="text" 
					className='TextBox' 
					value={CourseName} 
					onChange={(event)=>setCourseName(event.target.value)}
					placeholder='Course Name'/>

				<input type="text" 
					className='TextBox' 
					value={CourseCode} 
					onChange={(event)=>setCourseCode(event.target.value)}
					placeholder='Course Code'/>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] " 
						onClick={()=> { 
							if(CourseCode!==""&&CourseName!=="")
							{
								setPage("CO")
							}	
							else
							{
								const options = {
								"window" : "CourseWindow",
								"options" : {
									type: 'warning',
									buttons: ['Cancel'],
									title: 'Alert',
									message: 'You cannot proceed further!',
									detail: 'Enter Correct Course Details.',
								}};
								
								window.api.showDialog(options)
							}	
								
						} }>Next</button> 

			</div>}

			
			{ (Page === "CO") && 
			<div className="grid grid-flow-row items-center justify-center gap-2 p-2">
				<span className='select-none text-[20px]'>Add Course Outcomes</span>
				<div className="overflow-y-scroll w-screen h-[250px] pl-4 pr-4 ">
					
				{CourseOutcomeList.map((co,index)=>
				(<input type="text" 
						className='TextBox mb-2 w-full' 
						key={index}
						id={index}
						value={co.value} 
						onContextMenu={(event)=>{
										
							setSelectedTextBox(parseInt(event.target.id))
										
							if(event.pageX+120 > window.innerWidth)
							{
								setX(event.pageX-120)
							}
							else
							{
								setX(event.pageX)
							}
									
							setY(event.pageY)}
						}

						onChange={(event)=>{
								let list = [...CourseOutcomeList]
								list[event.target.id] = {"value":event.target.value};
								setCourseOutcomeList(list)
							}
						}

						placeholder={ `Course Outcome ${index+1}` } />
					))
					}

					<AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
					onClick={
						()=>{
							setCourseOutcomeList([...CourseOutcomeList,{"value":""}])
						}
					}/>

				</div>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[260px] Button w-[100px] "
						onClick={()=>{
							
							const options = {
								"window" : "CourseWindow",
								"options" : {
									type: 'warning',
									buttons: ['Cancel'],
									title: 'Alert',
									message: 'You cannot proceed further!',
									detail: 'Enter Correct Course Outcomes Details.',
							}};
							
							var l = CourseOutcomeList.filter((value)=> { return value.value==="" }).length
							if(l>0){
								window.api.showDialog(options)
								return
							}
							else
								setPage("Unit")
							
							
						}}>Next</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] opacity-80"
						onClick={()=>{ setPage("Course")} }>Back</button> 

			</div>}

			{ (Page === "Unit") && 
			<div className="grid grid-flow-row items-center justify-center gap-2 p-2">
				<span className='select-none text-[20px]'>Add Units</span>
				<div className="overflow-y-scroll w-screen h-[250px] pl-4 pr-4 ">
					
					{UnitList.map((unit,index)=>(
						<input type="text" 
							className='TextBox mb-2 w-full' 
							key={index}
							id={index}
							value={unit.value} 
							onContextMenu={(event)=>{
								setSelectedTextBox(parseInt(event.target.id))
										
								if(event.pageX+120 > window.innerWidth)
								{
									setX(event.pageX-120)
								}
								else
								{
									setX(event.pageX)
								}
									
								setY(event.pageY)}
							}

							onChange={(event)=>{
								let list = [...UnitList]
								list[event.target.id] = {"value":event.target.value}
								setUnitList(list)
							}}
							placeholder={ 'Unit' } />
					))
					}

					<AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
					onClick={
						()=>{
							let list = [...UnitList,{"value":""}]
							setUnitList(list)
						}
					}/>

				</div>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[260px] Button w-[100px] "
						onClick={()=>{
							
							const options = {
								"window" : "CourseWindow",
								"options" : {
									type: 'warning',
									buttons: ['Cancel'],
									title: 'Alert',
									message: 'You cannot proceed further!',
									detail: 'Enter Correct Unit Details.',
							}};
							
							let l = UnitList.filter((value=>{return value.value===""})).length
							
							if(l>0){
								window.api.showDialog(options)
								return
							}
							else{
								createCourse()
							}
							
						}}>Finish</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] opacity-80"
						onClick={()=>{ setPage("CO")} }>Back</button> 

			</div>}
        </div> 
    </div>
    )
}

export default NewCourse
