import React from "react"
import TitleBar from "./TitleBar"

class EditCourse extends React.Component
{
    constructor(props){
        super(props)
        const url = new URLSearchParams(window.location.search)
        this.state = {"CourseID":url.get("course_id"),"CourseName":url.get("course_name"),"CourseCode":url.get("course_code") }
    }

    componentDidMount(){
        
    }

    render()
    {
        const updateCourse = async(args) =>{
			await window.api.updateCourse(args)
			window.api.close("CourseWindow")
		}
        
        return(
            <div className="App">
                <TitleBar close={true} max={false} min={false} window="CourseWindow"></TitleBar>
                <div className="h-screen w-screen mt-8 bg-white flex justify-center items-start ">
                <div className="grid grid-flow-row items-center mt-20 justify-center gap-4">
				
				<span className='select-none text-[20px]'>Update Course</span>

				<input type="text" 
					className='TextBox' 
					value={this.state.CourseName} 
					onChange={(event)=>this.setState({"CourseName":event.target.value})}
					placeholder='Course Name'/>

				<input type="text" 
					className='TextBox' 
					value={this.state.CourseCode} 
					onChange={(event)=>this.setState({"CourseCode":event.target.value})}
					placeholder='Course Code'/>

				<button className="absolute bottom-5 right-[20px] Button w-[100px] opacity-80"
						onClick={()=>{ window.api.close("CourseWindow") } }>Cancel</button>

				<button className="absolute bottom-5 right-[140px] Button w-[100px] " 
						onClick={()=> { 
							if(this.state.CourseCode!==""&&this.state.CourseName!=="")
							{
								
								updateCourse(this.state)
								
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

			        </div>
                </div>
            </div>
        )
    }




}

export default EditCourse