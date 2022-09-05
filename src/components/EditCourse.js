import React from "react"
import TitleBar from "./TitleBar"
import {AiFillPlusCircle} from "react-icons/ai"
import ContextMenu from "./ContextMenu"

class EditCourse extends React.Component
{
    constructor(props){
        super(props)
        const url = new URLSearchParams(window.location.search)
        this.state = {
			"Course":{
				"CourseID":url.get("course_id"),
			},
			"Page":url.get("page"),
			"CourseOutcomeList":[{"value":""}],
			"UnitList":[{"value":""}],
			"x":0,
			"y":0
			}
    }

    componentDidMount(){
        if(this.state.Page === "Course")
		{
			new Promise((resolve,reject)=>{
				const Courses = window.api.getCourseFromID()
				if(Courses===undefined)
					reject("Course Not Found")
				resolve(this.setState({"Course":Courses}))
			})
		}
		else if(this.state.Page === "CO")
		{
			new Promise((resolve,reject)=>{
				const COs = window.api.getCOFromID()
				if(COs===undefined)
					reject("Course Outcomes Not Found")
				resolve(this.setState({"CourceOutcomeList": COs.map((value)=>{return {"value":value}})}))
			})
		}
		else 
		{
			new Promise((resolve,reject)=>{
				const Units = window.api.getUnitFromID()
	
				if(Units===undefined)
					reject("Course Outcomes Not Found")
				resolve(this.setState({"CourceOutcomeList": Units.map((value)=>{return {"value":value}})}))
			})
		}
    }

    render()
    {
        const updateCourse = async(args) =>{
			if(await window.api.updateCourse(args))
			{
				window.api.close("CourseWindow")
			}

		}

		const TextBoxContextMenuItems = [
			<li className="flex justify-center text-primary items-center cursor-pointer hover:bg-primary/10 "
				key={0}
				onClick={()=>{
					
					if(this.state.Page ==="CO")
					{
						let list = this.state.CourseOutcomeList.filter((_,i,__)=>{return i!== this.state.SelectedTextBox})
						this.setState({"CourseOutcomeList":list})
					}
					else if(this.state.Page==="Unit")
					{
					
						let list = this.state.UnitList.filter((_,i,__)=>{return i!== this.state.SelectedTextBox})
						this.setState({"UnitList":list})
					}
				}}>
				
				<span className="p-1 text-sm">Remove</span>
			</li>
		]
        
        return(
			
            <div className="App">
                <TitleBar close={true} max={false} min={false} window="CourseWindow"></TitleBar>
				
				<ContextMenu items={TextBoxContextMenuItems} x={this.state.x} y={this.state.y} ></ContextMenu>
        
				<div className="h-screen w-screen mt-8 bg-white flex justify-center items-start ">
				{this.state.Page === "Course" && <div className="grid grid-flow-row items-center mt-20 justify-center gap-4">
				
				<span className='select-none text-[20px]'>Update Course</span>

				<input type="text" 
					className='TextBox' 
					value={this.state.Course.CourseName} 
					onChange={(event)=>this.setState({"CourseName":event.target.value})}
					placeholder='Course Name'/>

				<input type="text" 
					className='TextBox' 
					value={this.state.Course.CourseCode} 
					onChange={(event)=>this.setState({"CourseCode":event.target.value})}
					placeholder='Course Code'/>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] " 
						onClick={()=> { 
							if(this.state.Course.CourseCode!==""&&this.state.Course.CourseName!=="")
							{
								updateCourse(this.state.Course)
							}	
							else
							{
								const options = {
								"window" : "NewCourseWindow",
								"options" : {
									type: 'warning',
									buttons: ['Cancel'],
									title: 'Alert',
									message: 'You cannot proceed further!',
									detail: 'Enter Correct Course Details.',
								}};
								
								window.api.showDialog(options)
							}	
								
						} }>Finish</button> 

			        </div>}
                

			{ (this.state.Page === "CO") && 
			<div className="grid grid-flow-row items-center justify-center gap-2 p-2">
				<span className='select-none text-[20px]'>Update Course Outcomes</span>
				<div className="overflow-y-scroll w-screen h-[250px] pl-4 pr-4 ">
					
				{this.state.CourseOutcomeList.map((co,index)=>
				(<input type="text" 
						className='TextBox mb-2 w-full' 
						key={index}
						id={index}
						value={co.value} 
						onContextMenu={(event)=>{			
								this.setState(event.target.id)
											
								if(event.pageX+120 > window.innerWidth)
								{
									this.setState({"x":event.pageX-120})
								}
								else
								{
									this.setState({"x":event.pageX})
								}
										
								this.setState({"y":event.pageY})
							}
						}

						onChange={(event)=>{
								let list = [...this.state.CourseOutcomeList]
								list[event.target.id] = {"value":event.target.value};
								this.setState({"CourseOutcomeList":list})
							}
						}

						placeholder={ `Course Outcome ${index+1}` } />
					))
					}

					<AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
					onClick={
						()=>{
							this.setState({"CourseOutcomeList":[...this.state.CourseOutcomeList,{"value":""}]})
						}
					}/>

				</div>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] "
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
							
							var l = this.state.CourseOutcomeList.filter((value)=> { return value.value==="" }).length
							if(l>0){
								window.api.showDialog(options)
								return
							}
							else
								this.setState({"Page":"Unit"})
							
							
						}}>Finish</button>

				</div>}

				{ (this.state.Page === "Unit") && 
			<div className="grid grid-flow-row items-center justify-center gap-2 p-2">
				<span className='select-none text-[20px]'>Add Units</span>
				<div className="overflow-y-scroll w-screen h-[250px] pl-4 pr-4 ">
					
					{this.state.UnitList.map((unit,index)=>(
						<input type="text" 
							className='TextBox mb-2 w-full' 
							key={index}
							id={index}
							value={unit.value} 
							onContextMenu={(event)=>{
								this.setState({"SelectedTextBox":event.target.id})
										
								if(event.pageX+120 > window.innerWidth)
								{
									this.setState({"x":event.pageX-120})
								}
								else
								{
									this.setState({"x":event.pageX})
								}
									
								this.setState({"y":event.pageY})
							}
						}

							onChange={(event)=>{
								let list = [...this.state.UnitList]
								list[event.target.id] = {"value":event.target.value}
								this.setState({"UnitList":list})
							}}
							placeholder={ 'Unit' } />
					))
					}

					<AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
					onClick={
						()=>{
							let list = [...this.state.UnitList,{"value":""}]
							this.setState({"UnitList":list})
						}
					}/>

				</div>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] "
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
							
							let l = this.state.UnitList.filter((value=>{return value.value===""})).length
							
							if(l>0){
								window.api.showDialog(options)
								return
							}
							else{
								//createCourse()
							}
							
						}}>Finish</button>


			</div>}
            </div>
		</div>
        )
    }




}

export default EditCourse