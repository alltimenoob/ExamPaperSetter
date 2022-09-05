import TitleBar from "./TitleBar"
import {BiBookContent} from "react-icons/bi"
import React from "react"
import ContextMenu from "./ContextMenu"

class OpenCourse extends React.Component
{
  constructor(props){
      super(props)
      this.state = {"ResultList":[],"SearchList":[],"SearchQuery":"","x":0,"y":0,"SelectedTextBox":""}
  }

  componentDidMount(){
    new Promise((resolve)=>{
      resolve( window.api.getCourses() )
    }).then((result)=>{
      console.log("Heh")
    if(result.statusCode)
    {
      this.setState({"ResultList":result.courses,"SearchList":result.courses})
    }})
  }

  render() {
     
    
    const openNewCourse = async() =>
    {
      await window.api.openNewCourse()
    }

    const updateCourse = async(args) =>{
      await window.api.updateCourseWindow(args)
    }

    const removeCourse = async(args) =>{
      await window.api.removeCourse(args)
    }

    const TextBoxContextMenuItems = [
      <li className="flex justify-start text-primary items-center cursor-pointer hover:bg-primary/10 "
          key={0}
          onClick={()=>{
            let temp = this.state.ResultList.filter((value)=>{ return value.id.toString() === this.state.SelectedTextBox })
      
            if(temp[0]!==undefined)
              updateCourse({"key":temp[0],"page":"Course"}) 
          }}>
          <span className="ml-5 p-1 text-sm">Edit Course</span>
		  </li>,
      <li className="flex justify-start text-primary items-center cursor-pointer hover:bg-primary/10 "
      key={0}
      onClick={()=>{
        let temp = this.state.ResultList.filter((value)=>{ return value.id.toString() === this.state.SelectedTextBox })
  
        if(temp[0]!==undefined)
          updateCourse({"key":temp[0],"page":"CO"}) 
      }}>
      <span className="ml-5 p-1 text-sm">Edit COs</span>
      </li>,
      <li className="flex justify-start text-primary items-center cursor-pointer hover:bg-primary/10 "
          key={0}
          onClick={()=>{
            let temp = this.state.ResultList.filter((value)=>{ return value.id.toString() === this.state.SelectedTextBox })
      
            if(temp[0]!==undefined)
              updateCourse({"key":temp[0],"page":"Unit"}) 
          }}>
          
          <span className="ml-5 p-1 text-sm">Edit Units</span>
		  </li>,
      <li className="flex justify-start text-primary items-center cursor-pointer hover:bg-primary/10 "
          key={1}
          onClick={()=>{
              let temp = this.state.SearchList.filter((value)=>{return value.id.toString() !== this.state.SelectedTextBox})
              this.setState({"SearchList":temp},()=>{
                removeCourse(this.state.SelectedTextBox)
              })
          }}>
          <span className="ml-5 p-1 text-sm">Remove</span>
		  </li>
    ]
    return(
      <div className="App" onClick={()=>{this.setState({"x":0});this.setState({"y":0})}}>
        <ContextMenu items={TextBoxContextMenuItems} x={this.state.x} y={this.state.y} ></ContextMenu>
        
        {/* TitleBar Containing Name , Minimize, Maximize, Close*/}
        <TitleBar name="Exam Paper" max={true} min={true} close={true} window="mainWindow"></TitleBar>
       
        <div className='mt-8 w-screen h-screen bg-white'>
          <div className='grid grid-flow-col grid-cols-4 justify-items-start items-center gap-1 m-2 w-full'>
            <input type="text" placeholder="Search" value={this.state.SearchQuery} onChange={(event)=>{
              
              this.setState({"SearchQuery":event.target.value})
              
              let temp = this.state.ResultList
            
              if(event.target.value !== "")
                temp = temp.filter((value)=>{ return value.name.includes(event.target.value)  })
              
              this.setState({"SearchList":temp})
            }} 
            className="TextBox w-full col-span-4 "/>
            <button className='Button w-[140px] mr-4' onClick={openNewCourse}>New Course</button>
          </div>      
          <hr className="ml-2 mr-2"></hr>  

          <div className='grid justify-items-start items-center gap-1 w-full p-2 text-primaryDark'>

            <div className="overflow-y-scroll w-full max-h-screen">
              {this.state.SearchList.length === 0 ? <span className="select-none text-[18px]">No Courses Found</span> : ""}
              {this.state.SearchList.map((value)=>{
                 
                  return(<div key={value.id} id={value.id}  className=" border-2 w-full items-center p-2 flex h-[60px] shadow rounded  hover:cursor-pointer"
                          onContextMenu={(event)=>{			
                            
                            this.setState({"SelectedTextBox":event.currentTarget.id},()=>{
                            
                              if(event.pageX+120 > window.innerWidth)
                              {
                                this.setState({"x":(event.pageX-120)})
                              }
                              else
                              {
                                this.setState({"x":(event.pageX)})
                              }

                              this.setState({"y":(event.pageY)})
                            })
                          }
                            
                            
                  } >
                  <BiBookContent className="h-[60px] w-[25px]"/>
                  <div  className="flex ml-2 flex-col justify-center  p-2 items-start">
                    <span className="text-start text-[18px]">{value.name}</span>
                  </div>
                  </div>)
              })}
              
            </div>
 
          </div>

        </div>
      </div>
      
      )
    }
}

export default OpenCourse;