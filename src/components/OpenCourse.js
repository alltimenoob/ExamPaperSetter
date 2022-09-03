import TitleBar from "./TitleBar"
import {BiBookContent} from "react-icons/bi"
import React from "react"

class OpenCourse extends React.Component
{
  constructor(props){
      super(props)

      this.state = {"ResultList":[],"SearchList":[],"SearchQuery":""}
  }

  componentDidMount(){
      
    new Promise((resolve)=>{
      resolve( window.api.getCourses() )
    }).then((result)=>{
          
    if(result.statusCode)
    {
      this.setState({"ResultList":result.courses,"SearchList":result.courses})
    }

  })
    
  }

  render() {
     

    const openNewCourse = async() =>
    {
      await window.api.openNewCourse()    
    }

  
    return(
      <div className="App">
        {/* TitleBar Containing Name , Minimize, Maximize, Close*/}
        <TitleBar name="Exam Paper" max={true} min={true} close={true} window="mainWindow"></TitleBar>

        {/* Left Aligned Functionality(drawers) Navigator With Icons(items) */}
        <div className='mt-8 w-screen h-screen bg-white'>
          <div className='grid grid-flow-col grid-cols-4 justify-items-start items-center gap-1 m-2 w-full'>
            <input type="text" placeholder="Search" value={this.state.SearchQuery} onChange={(event)=>{
              this.setState({"SearchQuery":event.target.value})
              let temp = this.state.ResultList
              if(event.target.value !== "")
                temp = temp.filter((value)=>{ return value.name.includes(this.state.SearchQuery)  })
              
              this.setState({"SearchList":temp})

            }}className="TextBox w-full col-span-4 "/>
            <button className='Button w-[140px] mr-4' onClick={openNewCourse}>New Course</button>
          </div>      
          <hr className="ml-2 mr-2"></hr>  
          
          <div className='grid justify-items-start items-center gap-1  w-full p-2  text-primaryDark'>
              
            <div className="overflow-y-scroll w-full max-h-screen">
              {this.state.SearchList.map((value,i)=>{
                  return(<div key={i} className=" border-2 w-full items-center p-2 flex h-[60px] shadow rounded  hover:cursor-pointer">
                  <BiBookContent className="h-[60px] w-[25px]"/>
                  <div className="flex ml-2 flex-col justify-center  p-2 items-start">
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