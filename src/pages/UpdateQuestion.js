import {  useEffect, useState, useCallback } from "react"
import TitleBar from "../components/TitleBar"
import {IoArrowBackCircleOutline} from "react-icons/io5"
import QuestionsList from "../components/QuestionsList"
import {default as Select,components} from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateQuestion(){

  const CourseID = new URLSearchParams(window.location.search).get("course_id")

  const [FullQuestionsList, setFullQuestionsList] = useState([{}]) 
  
  const [SearchQuery,setSeachQuery] = useState("")
  const [FilteredQuestions,setFilteredQuestions] = useState([{}])

  const component = (props)=>{
    return( <div className="p-0">
            <components.Option {...props} >
              <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
              />
              <label className="ml-2">{props.label}</label>
            </components.Option>
          </div>)
    }

    useEffect(()=>{
      const questions = window.api.getQuestions({ course_id: CourseID }) 

      questions.then((result) => {
        
        result = result.map((value) => {
          value.value = value.question_id 
          value.label = value.question_text 
          delete value.question_id 
          delete value.question_text 

          return value 
        })
        
        setFullQuestionsList(result)
        setFilteredQuestions(result)
      })


    },[CourseID])

    
    return(
    
    <div className="App">
      <TitleBar name="Manage Questions" close={true} max={true} min={true} window="mainWindow"/>
        
      <IoArrowBackCircleOutline className="fixed top-8 left-0 right-0 bottom-0 w-9 h-9 text-white ml-1 mr-1"
        onClick={()=>{
          window.api.goBack()
        }} />
            
      <div className="fixed top-8 left-11 right-0 bottom-0 w-full h-full bg-white ">
        <div className="fixed top-8 right-0 left-11 ">
          <div className="m-5 flex">
              <input type="text" className="TextBox w-full"
                onChange={useCallback((event)=>{
                  setSeachQuery(event.currentTarget.value)
                  var temp = FullQuestionsList
                  temp = temp.filter((value)=>{
                      const label = value.label.toUpperCase()
                      return label.includes(event.currentTarget.value.toUpperCase())
                  })
                  console.log(temp)
                  setFilteredQuestions(temp)
                })}
                placeholder="Search"
                value={SearchQuery} />
          </div>
          <div className="fixed top-16 bottom-0 left-3 right-0 p-5">
            <QuestionsList list={FilteredQuestions} />
          </div>
        </div>
        
      </div>
      
                
            
    </div>)


}
