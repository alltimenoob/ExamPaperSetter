import { useEffect, useState,useRef } from "react"

export default function QuestionFilter(props){

    const CourseID = props.CourseID

    var SelectedFilter = props.SelectedFilter

    const [CourseOutcomeList, setCourseOutcomeList] = useState([{ value: "" }]) 
    const [UnitsList, setUnitsList] = useState([{ value: "" }]) 
    const [TaxonomyList, setTaxonomyList] = useState([{}]) 
    const [TypeList, setTypeList] = useState([{}]) 

    const calculateFilter = props.Callback

    const tracker = useRef(0)

    useEffect(() =>{
        tracker.current++

        const getFilterDetails = async () =>{
          const taxonomy = window.api.getTaxonomy(CourseID) 
          const co = window.api.getCOs(CourseID) 
          const units = window.api.getUnits(CourseID) 
          const types = window.api.getQuestionTypes(CourseID) 

          await Promise.all([taxonomy, co, units, types]).then((values) => {
              setUnitsList(
                  values[2].units.map((value) => {
                  return {
                      label:  value.unit_name,
                      value: value.unit_id,
                  } 
                  })
              ) 
              setCourseOutcomeList(
                  values[1].cos.map((value) => {
                  return {
                      label:  value.course_outcomes_description,
                      value: value.course_outcomes_id,
                  } 
                  })
              ) 
              setTaxonomyList(
                  values[0].taxonomy.map((value) => {
                  return {
                      label: value.taxonomy_name,
                      value: value.taxonomy_id,
                      percentage: 0,
                  } 
                  })
              ) 
              setTypeList(
                  values[3].question_types.map((value) => {
                  return {
                      label: value.question_type_name,
                      value: value.question_type_id,
                  } 
                  })
              ) 
          }) 
        }

        getFilterDetails()

    },[CourseID])

    return(
    
    <div className={` ${(props.ShowFilter) ? `visible ` : `invisible`} p-1 absolute top-24 z-50 h-[300px] w-[300px] items-start justify-start rounded-lg shadow-lg text-white font-bold left-11 bg-primary`}>
      
      <span>{tracker.current}</span>

      <div className="flex gap-2 p-2 text-primary overflow-x-scroll w-full filter  " > 
      {CourseOutcomeList.map((value,i)=>{
        return<span key={i} className="flex-none bg-white p-1 rounded min-w-[50px] w-max text-[12px] cursor-pointer" onClick={(event)=>{

          if(event.currentTarget.style.backgroundColor === "rgb(255, 30, 0)")
          {
            event.currentTarget.style = "background-color:white   color:rgb(28 103 88) "
            const temp = SelectedFilter
            const index = temp.course_outcomes.indexOf(value.value) 
            temp.course_outcomes.splice(index,1) 
            console.log(temp)
            calculateFilter(temp) 
          }
          else
          {
            event.currentTarget.style = "background-color:rgb(255, 30, 0); color:white "
            const temp = SelectedFilter
            temp.course_outcomes.indexOf(value.value) === -1 ? temp.course_outcomes.push(value.value) : console.log() 
            console.log(temp)
            calculateFilter(temp)
          }
           

          
        }}>CO : {value.label}</span>
       })}
      </div>

      <div className="flex gap-2 p-2 text-primary overflow-x-scroll w-full filter  " > 
      {UnitsList.map((value,i)=>{
        return<span 
          key={i} 
          className="bg-white p-1 rounded min-w-[50px] w-max text-[12px] cursor-pointer" 
          onClick={(event)=>{
            if(event.currentTarget.style.backgroundColor === "rgb(255, 30, 0)")
            {
              event.currentTarget.style = "background-color:white; color:rgb(28 103 88) "
              const temp = SelectedFilter
              const index = temp.units.indexOf(value.value) 
              temp.units.splice(index,1) 
              console.log(temp)
              
              calculateFilter(temp)
            }
            else
            {
              event.currentTarget.style = "background-color:rgb(255, 30, 0); color:white "
              const temp = SelectedFilter
              temp.units.indexOf(value.value) === -1 ? temp.units.push(value.value) : console.log() 
              console.log(temp)
              
              calculateFilter(temp)
            }
          }}>Unit : {value.label}</span>
       })}
      </div>

      <div className="flex  gap-2 p-2 text-primary overflow-x-scroll w-full filter  " > 
      {TypeList.map((value,i)=>{
        return<span key={i} className="bg-white p-1 rounded  min-w-[50px] w-max  text-[12px] cursor-pointer" onClick={(event)=>{
          if(event.currentTarget.style.backgroundColor === "rgb(255, 30, 0)")
          {
            event.currentTarget.style = "background-color:white; color:rgb(28 103 88) "
            const temp = SelectedFilter
            const index = temp.types.indexOf(value.value) 
            temp.types.splice(index,1) 
            console.log(temp)
            calculateFilter(temp)
          }
          else
          {
            event.currentTarget.style = "background-color:rgb(255, 30, 0); color:white "
            const temp = SelectedFilter
            temp.types.indexOf(value.value) === -1 ? temp.types.push(value.value) : console.log() 
            console.log(temp)
            calculateFilter(temp)
          }
        }}>{value.label}</span>
       })}
      </div>

      <div className="flex  gap-2 p-2 text-primary overflow-x-scroll w-full filter  " > 
      {TaxonomyList.map((value,i)=>{
        return<span key={i} className="bg-white p-1 rounded  min-w-[50px] w-max text-[12px] cursor-pointer" onClick={(event)=>{
          
          if(event.currentTarget.style.backgroundColor === "rgb(255, 30, 0)")
            {
              event.currentTarget.style = "background-color:white; color:rgb(28 103 88) "
              const temp = SelectedFilter
              const index = temp.taxonomies.indexOf(value.value) 
              temp.taxonomies.splice(index,1) 
              console.log(temp)
              
              calculateFilter(temp)
            }
            else
            {
              event.currentTarget.style = "background-color:rgb(255, 30, 0); color:white "
              const temp = SelectedFilter
              temp.taxonomies.indexOf(value.value) === -1 ? temp.taxonomies.push(value.value) : console.log() 
              console.log(temp)
              
              calculateFilter(temp)
            }

        }}>{(value.label!==undefined) ?  value.label.toUpperCase() : value.label }</span>
       })}
      </div>
    </div>
    )
}