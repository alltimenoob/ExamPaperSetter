import TitleBar from "./TitleBar"
import {IoArrowBackCircleOutline} from "react-icons/io5"
import { useEffect, useState } from "react"
import {default as Select,components} from 'react-select'
import {AiFillPlusCircle} from "react-icons/ai"

export default function GeneratePaper(props){

    const CourseID = new URLSearchParams(window.location.search).get("course_id")

    const [CourseOutcomeList,setCourseOutcomeList] = useState([{"value":""}])
	const [UnitsList,setUnitsList] = useState([{"value":""}])
    const [TaxonomyList,setTaxonomyList] = useState([{}])
    const [TypeList,setTypeList] = useState([{}])
    const [QuestionsList,setQuestionsList] = useState([{}])
    const [Instructions,setInstructions] = useState([{"value":"","id":0}])

    const [SelectByUnit,setSelectByUnit] = useState(false)

    const [SelectedCOList,setSelectedCOList] = useState([])
    const [SelectedUnitList,setSelectedUnitList] = useState([])

    const [TotalMarks,setTotalMarks] =  useState('')
    const [Year,setYear] =  useState('')
    const [Stream,setStream] =  useState('')
    const [AY,setAY] =  useState('')
    const [Semester,setSemester] =  useState('')
    const [Date,setDate] = useState('')
    const [Time,setTime] = useState('')
    const [ExamType,setExamType] = useState('')
    const [TotalQuestions,setTotalQuestions] = useState('')

    const [QDetails,setQDetails] = useState([])

    

    useEffect(()=>{
        const taxonomy = window.api.getTaxonomy(CourseID)
        const co = window.api.getCOs(CourseID)
        const units = window.api.getUnits(CourseID)
        const types = window.api.getQuestionTypes(CourseID)

        Promise.all([taxonomy,co,units,types]).then((values)=>{
            setUnitsList(values[2].units.map((value)=>{
                return {
                    "label": "Unit : "+value.unit_name,
                    "value":value.unit_id.toString()
                }
            }))
            setCourseOutcomeList(values[1].cos.map((value)=>{
                return {
                    "label" : "CO : "+value.course_outcomes_description,
                    "value" : value.course_outcomes_number
                }
            }))
            setTaxonomyList(values[0].taxonomy.map((value)=>{
                return {
                    "label" : value.taxonomy_name,
                    "value" : value.taxonomy_id,
                    "percentage": 0,
                }
            }))
            setTypeList(values[3].question_types.map((value)=>{
                return { 
                    "label" : value.question_type_name,
                    "value" : value.question_type_id
                }
            }))
        })

        const questions = window.api.getQuestions(CourseID)

        questions.then((value)=>{
           
            setQuestionsList(value.questions.map((value)=>{
                return {
                    "marks" : value.marks,
                    "value": value.question_type_id,
                    "label": value.question_text
                   /* question_type_id: 2
                    taxonomy_id: 1
                    unit_id: 3 */
                }
            }))
        })


   }
   ,[CourseID])

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

    return(
        <div className="App">
            <TitleBar name={"Generate Paper"} close={true} max={true} min={true} window="mainWindow"/>
            <IoArrowBackCircleOutline className="mt-8 w-9 h-9 text-white ml-1 mr-1"
            onClick={()=>{
                window.api.goBack()
            }} />
            <div className='mt-8 p-5 w-screen h-screen overflow-y-scroll bg-white flex flex-col items-start'>
               
                <div>
                    <input id="selectbyunit" type="checkbox" onChange={(()=>{
                        setSelectByUnit(!SelectByUnit)
                    })} />
                    <label htmlFor="selectbyunit" className="text-xl " > Select By Unit ?</label>
                </div>

                <div className="mt-5 w-full flex flex-col gap-2">
                        { !SelectByUnit && <span
                            className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                            <Select
                                placeholder={"Select COs"}
                                options={CourseOutcomeList}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option : component
                                }}
                                onChange={(list)=>{setSelectedCOList(list) ; setSelectedUnitList([])}}
                                allowSelectAll={true}
                                value={SelectedCOList}
                                />
                        </span> }


                        { SelectByUnit && <span
                            className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">

                            <Select
                                placeholder={"Select Unit"}
                                options={UnitsList}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option : component
                                }}
                                isMulti
                                onChange={(value)=>{setSelectedUnitList(value); setSelectedCOList([])}}
                                allowSelectAll={true}
                                value={SelectedUnitList}
                                />
                        </span> } 
                    </div>

                    <span className="mt-5 self-start text-xl"> Meta Data </span>   

                    <div className="mt-5 w-full gap-2 grid grid-flow-row grid-cols-2">
                        <input type="text"
                                value={Year}
                                onChange={(event)=>{
                                        setYear(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Year (First/Second)"/>
                        <input type="text"
                                value={Stream}
                                onChange={(event)=>{
                                        setStream(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Stream (B.Tech,M.Tech)"/>
                        <input type="text"
                                value={Semester}
                                onChange={(event)=>{
                                        setSemester(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Semester (Odd/Even)"/>
                        <input type="text"
                                value={ExamType}
                                onChange={(event)=>{
                                        setExamType(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Exam Type"/>
                        <input type="text"
                                value={AY}
                                onChange={(event)=>{
                                        setAY(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Acadamic Year (2020-21)"/>
                        <input type="text"
                                value={Date}
                                onChange={(event)=>{
                                        setDate(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Date"/>
                        <input type="text"
                                value={Time}
                                onChange={(event)=>{
                                        setTime(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Time"/>
                        <input type="number"
                                onWheel={(event)=>{event.currentTarget.blur()}}
                                value={TotalMarks}
                                onChange={(event)=>{
                                        setTotalMarks(event.currentTarget.value)
                                }}
                                className="TextBox w-full"
                                placeholder="Enter Total Marks"/>
                       
                    </div>

                    <span className="mt-5 self-start text-xl"> Instructions </span>    

                    <div className="mt-5 w-full flex flex-col gap-2">
                      
                    {Instructions.map((value,index)=>
                        (<input type="text" 
                                className='TextBox mb-2 w-full' 
                                key={index}
                                id={index}
                                value={value.value} 
                            
                                onChange={(event)=>{
                                        let list = [...Instructions]
                                        list = list.map((value)=>{
                                            if(value.id == event.target.id)
                                            {
                                                value.value = event.currentTarget.value
                                            }
                                            return value
                                        })
                                        setInstructions(list)
                                    }
                                }

                                placeholder={ `Instructions ${index+1}` } />
                            ))
					}

					<AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
					onClick={
						()=>{
							setInstructions([...Instructions,{"value":"",id:Instructions.length }])
						}
					}/>
                                
                    </div>

                    <span className="mt-5 self-start text-xl"> Questions </span> 

                    <div className="mt-8 w-full h-full flex flex-col gap-2 ">
                            <div className="flex gap-2">
                               
                                <input type="number"
                                value={TotalQuestions}
                                    onWheel={(event)=>{event.currentTarget.blur()}}
                                    onChange={(event)=>{
                                        setTotalQuestions(event.currentTarget.value)
                                        
                                        const temp = [...Array(parseInt(event.currentTarget.value))].map((value,i)=>{
                                                return({
                                                    "filter":{
                                                        "marks":[],
                                                        "taxonomy":[],
                                                        "type":[]
                                                    },
                                                    "showFilter":false,
                                                    "showText":true,
                                                    "text":{"label":``,"value":-1,"marks":0},
                                                    "subq":[]
                                                })
                                            })
                                  
                                        setQDetails(temp)
                                       
                                    }}
                                    className="TextBox w-full" 
                                    placeholder="Enter Total Questions"/>
                            </div>

                            {QDetails.map((value,i)=>{
                                return(
                                    <div key={i} className="flex flex-col w-full items-center justify-center border-b-primary border-2">
                                        
                                        <div className="flex max-h-[50px] w-full justify-start items-center">


                                            <span className="ml-2 text-[16px]">Q.{i+1}</span>
                                            { value.showText && <input id={"I"+i} type="text" className="TextBox m-2 w-full flex-1" value={value.text.label}
                                            onChange={(event)=>{
                                                const temp = [...QDetails]
                                                setQDetails(temp.map((value,i)=>{
                                                    if("I"+i === event.currentTarget.id)
                                                    {
                                                        value.text.label = event.currentTarget.value
                                                    } 
                                                    return value
                                                }))
                                            }}
                                            placeholder="Enter Question" /> }

                                            { !value.showText && <span
                                                    className="w-full p-0 text-[16px] m-2 text-start flex-1">
                                                    <Select
                                                        name={"Q"+i}
                                                        placeholder={"Select Question"}
                                                        options={QuestionsList}
                                                        hideSelectedOptions={true}
                                                        onChange={(text,event)=>{
                                                            const temp = [...QDetails]
                                                            setQDetails(temp.map((value,i)=>{
                                                                if(event.name === "Q"+i)
                                                                {
                                                                    value.text = text
                                                                }
                                                                return value
                                                            }))
                                                        }}
                                                        value={value.text}
                                                        />
                                                </span> }

                                                <input type="checkbox" id={"T"+i} className="Button m-2 flex-3 " onClick={(event)=>{
                                                    
                                                    const temp = [...QDetails]

                                                    setQDetails(temp.map((value,i)=>{
                                                            
                                                            if("T"+i === event.currentTarget.id)
                                                            {
                                                                value.showText = !value.showText
                                                            }

                                                            return value
                                                        }))
                                                    }}/>

                                                <label htmlFor={"T"+i} className="text-[16px] flex-3">Question As Main</label>

                                        </div>

                                        <div className="flex items-center justify-center">
                                            <button id={"B"+i} className="Button m-2 w-[200px]" onClick={(event)=>{
                                                const temp = [...QDetails]
                                                setQDetails(temp.map((value,i)=>{
                                                    if("B"+i === event.currentTarget.id )
                                                    {
                                                        value.showFilter = !value.showFilter
                                                    }
                                                    return value
                                                }))
                                            }}>Filter</button>
                                            
                                        </div>
                                        {value.showFilter && <div className="flex flex-col gap-2 ">
                                        
                                            <span
                                                className="min-w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                                                <Select
                                                    name={"F0"+i}
                                                    placeholder={"Filter By Type"}
                                                    options={TypeList}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    components={{
                                                        Option : component
                                                    }}
                                                    onChange={(list,event)=>{
                                                        const temp = [...QDetails]
                                                        setQDetails(temp.map((value,i)=>{
                                                            if(event.name === "F0"+i)
                                                            {
                                                                value.filter.type = list
                                                            }
                                                            return value
                                                        }))
                                                    }}
                                                    allowSelectAll={true}
                                                    value={value.filter.type}
                                                    />
                                            </span> 
                                            <span
                                                className="min-w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                                                <Select
                                                    name={"F1"+i}
                                                    placeholder={"Filter By Taxonomy"}
                                                    options={TaxonomyList}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    components={{
                                                        Option : component
                                                    }}
                                                    onChange={(list,event)=>{
                                                        const temp = [...QDetails]
                                                        setQDetails(temp.map((value,i)=>{
                                                            if(event.name === "F1"+i)
                                                            {
                                                                value.filter.taxonomy = list
                                                            }
                                                            return value
                                                        }))
                                                    }}
                                                    allowSelectAll={true}
                                                    value={value.filter.taxonomy}
                                                    />
                                            </span>
                                        </div>}
                                        <div className="flex flex-col w-[60vw]">
                                            {value.subq.map((value,i1)=>{
                                                return( <span
                                                    key={i1}
                                                    className="w-full p-0 text-[16px] m-2 text-start flex-1">
                                                    <Select
                                                        name={i+" "+i1}
                                                        placeholder={"Select Question"}
                                                        options={QuestionsList}
                                                        hideSelectedOptions={true}
                                                        onChange={(text,event)=>{
                                                            const temp = [...QDetails]
                                                            setQDetails(temp.map((value,i2)=>{
                                                                const ids = event.name.split(" ")

                                                               
                                                                if(parseInt(ids[0]) === i2)
                                                                {
                                                                    value.text.marks += text.marks
                                                                    const sq = [...value.subq]
                                                                    sq[parseInt(ids[1])] = text
                                                                    value.subq = sq
                                                                }
                                                                
                                                                return value
                                                            }))
                                                            console.log(temp.map((value,i2)=>{
                                                                const ids = event.name.split(" ")

                                                                if(parseInt(ids[0]) === i2)
                                                                {
                                                                    const sq = [...value.subq]
                                                                    sq[parseInt(ids[1])] = text
                                                                    value.subq = sq
                                                                }
                                                                
                                                                return value
                                                            }))
                                                        }}
                                                        value={value}
                                                        />
                                                </span> )
                                            })}
                                        </div>
                                        {value.showText && <AiFillPlusCircle className="text-primary m-2" 
                                        id = {"P"+i}
                                        onClick={(event)=>{
                                            const temp = [...QDetails]
                                            setQDetails(temp.map((value,i)=>{
                                                if(event.currentTarget.id === "P"+i)
                                                {
                                                    value.subq = [...value.subq,{"label":"","value":""}]
                                                }
                                            
                                                return value
                                            }))
                                        }} /> }
                                    </div>
                                )
                            })}


                            <button className="Button mb-32" 
                            onClick={()=>{
                                const Course = window.api.getCourseFromID(CourseID).then((value)=>{

                                    window.api.generateTex({
                                        "MetaData":{
                                            "CourseCode" : value.code,
                                            "CourseName" : value.name,
                                            "TotalMarks":TotalMarks,
                                            "Year":Year,
                                            "Stream":Stream,
                                            "AY":AY,
                                            "ExamType":ExamType,
                                            "Semester":Semester,
                                            "Date" :Date,
                                            "Time" :Time,
                                            "Instructions":Instructions
                                        },                    
                                        "QuestionDetails":QDetails           
                                    })

                                })
                            }}>Generate</button>
                            
                    </div>
            </div>



        </div>
    )

}
