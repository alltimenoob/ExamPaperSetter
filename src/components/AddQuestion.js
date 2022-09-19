import {  useEffect, useState } from "react"
import TitleBar from "./TitleBar"
import {AiFillPlusCircle} from "react-icons/ai"
import {IoArrowBackCircleOutline} from "react-icons/io5"
import {BiReset} from "react-icons/bi"
import {default as Select,components} from 'react-select';
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddQuestion(){

    const CourseID = new URLSearchParams(window.location.search).get("course_id")

    const [SelectedType,setSelectedType] = useState(0)
    const [Options,setOptions] = useState([{"value":""}])
    const [Question,setQuestion] = useState("")
    const [Taxonomy,setTaxonomy] = useState(0)
    const [Marks,setMarks] = useState(0)
    
    const [CourseOutcomeList,setCourseOutcomeList] = useState([{"label":"CO 1","value":"1"},{"label":"CO 2","value":"2"}]);
    const [UnitsList,setUnitsList] = useState([{"label":"Unit 1","value":"1"},{"label":"Unit 2","value":"2"}]);
    const [TypeList,setTypeList] = useState([])
    const [TaxonomyList,setTaxonomyList] = useState([{"value":"Apply"},{"value":"Analyze"}])

    const [SelectedCOList,setSelectedCOList] = useState(null)
    const [SelectedUnit,setSelectedUnit] = useState(null)
    const [SelectedImage,setSelectedImage] = useState("")
    const [ShowImage,setShowImage] = useState(false)

    useEffect ( ()=>{

        const units =  window.api.getUnits(CourseID)
        const co = window.api.getCOs(CourseID)
        const taxonomy =  window.api.getTaxonomy()
        const types =  window.api.getQuestionTypes()

        Promise.all([units,co,taxonomy,types]).then((values)=>{
           
            setUnitsList(values[0].units.map((value)=>{
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
            setTaxonomyList(values[2].taxonomy)
            setTaxonomy(values[2].taxonomy[0].taxonomy_id)
            setTypeList(values[3].question_types)
            setSelectedType(values[3].question_types[0].question_type_id)
        }).catch(()=>{
            const options = {
                "window" : "CourseWindow",
                "options" : {
                    type: 'error',
                    buttons: ['Ok'],
                    title: 'Error',
                    message: 'Something went wrong with database!',
                    detail: 'There might be some issues like empty fields, disrupted database connection',
            }};
         
            window.api.showDialog(options)
            window.api.goBack()
        })
        
        
    },[CourseID])

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
            <TitleBar name={"Add Questions"} close={true} max={true} min={true} window="mainWindow"/>
        
            <IoArrowBackCircleOutline className="mt-8 w-9 h-9 text-white ml-1 mr-1"
            onClick={()=>{
                window.api.goBack()
            }} />
            
            <div className='mt-8 pb-9 w-screen h-screen bg-white flex items-start overflow-y-scroll'>
               
                <div className="m-5 mt-10 flex flex-col gap-2 w-screen max-h-full ">
                    
                    <div className="flex gap-2">
                        <select className="TextBox w-full " value={SelectedType} 
                            onChange={(event)=>{
                                setSelectedType(event.currentTarget.value)
                            }} id="types">
                            {TypeList.map((value,index)=>{
                                return(<option key={index} value={value.question_type_id}>{value.question_type_name}</option>)
                            })}
                            
                        </select>

                            

                        <select className="TextBox w-full" id="types" value={Taxonomy} 
                        onChange={(event)=>{
                            setTaxonomy(event.currentTarget.value)
                        }}>
                            {TaxonomyList.map((value,index)=>{
                                return(<option key={index} value={value.taxonomy_id}>{value.taxonomy_name}</option>)
                            })}
                        </select>
                    </div>
                    
                    <div className="flex gap-2">
                        <span
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
                                onChange={(list)=>{setSelectedCOList(list)}}
                                allowSelectAll={true}
                                value={SelectedCOList}
                                />
                        </span>


                        <span
                            className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">

                            <Select
                                placeholder={"Select Unit"}
                                options={UnitsList}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option : component
                                }}
                                onChange={(value)=>{setSelectedUnit(value)}}
                                allowSelectAll={true}
                                value={SelectedUnit}
                                />
                        </span>
                    </div>
                    
                    
                    <input type="text" className="TextBox w-full" value={Question}
                    onChange={(event)=>{
                        setQuestion(event.currentTarget.value)
                    }} placeholder="Enter Question"/>     

                    {TypeList.find((value)=>{
                            return (value.question_type_name === "MCQ") && (value.question_type_id.toString() === SelectedType.toString())
                        })!==undefined&&<div className="grid w-full grid-flow-col grid-cols-6">
                        
                        {Options.map((value,index)=>{
                          
                            return(<input type="text"
                                key={index} 
                                value={value.value}
                                className='TextBox mb-2 w-full' 
                                onChange={(event)=>{
                                    console.log(Options)
                                    const temp = [...Options]
                                    temp[index] = {"value":event.currentTarget.value}
                                    setOptions(temp)
                                }}
                                placeholder={"Option "+ String.fromCharCode(index+65) } /> )
                            
                        })}
                        
                        <AiFillPlusCircle className="m-auto h-[28px] text-primary cursor-pointer" 
                        onClick={()=>{
                            if([...Options].length < 6)
                                setOptions([...Options,{"value":""}])
                        }}/>
                    
                    </div>}

                    <input type="number" className="TextBox w-full" value={Marks} 
                    onChange={(event)=>{
                        setMarks(event.currentTarget.value)
                    }} placeholder="Enter Marks"/>                 

                    <label className="TextBox w-full flex items-center justify-start">
                        <input type="checkbox" checked={ShowImage} onChange={(event)=>{
                            setShowImage(!ShowImage)
                            if(ShowImage)
                            {
                                setSelectedImage("")
                            }
                            }}/>
                        <span className="ml-2">Attach Diagram,Table? </span>
                    </label> 
                    
                    {ShowImage && SelectedImage!== "" &&<img src={SelectedImage} height="50px" width="50px"  alt="None" />}
                   

                    {ShowImage&&<label className="Button w-full flex items-center justify-center">
                        <input type="file" className="hidden" accept="image/png, image/gif, image/jpeg" onChange={(event)=>{
                            const path = event.target.files[0]

                            new Promise((resolve,reject)=>{
                                let file = new FileReader()
                                file.onload = (event) => { 
                                    setSelectedImage(event.target.result)
                                    resolve(event.target.result)
                                 }
                                file.onerror = (err)  => { reject(err) }
                                file.readAsDataURL(path)
                            })

                        }}/>
                        
                        <span>Select Image</span>
                    </label> }

                     <div className="flex w-full gap-2 justify-center items-center">
                        
                        <button  className="Button mt-5 flex-1" onClick={()=>{
                            const args = {
                                "course_id" : CourseID,
                                "question_text" : Question,
                                "question_type_id": SelectedType,
                                "isMCQ": TypeList.find((value)=>{
                                    return (value.question_type_id.toString() === SelectedType.toString()) && (value.question_type_name === "MCQ") 
                                }) !== undefined,
                                "marks": Marks,
                                "options":Options.map((value)=>{return value.value}),
                                "taxonomy_id": Taxonomy,
                                "unit_id": parseInt(SelectedUnit.value),
                                "cource_outcome_ids": SelectedCOList.map(value => { return value.value }),
                                "question_image" : SelectedImage
                            }

                            
                            window.api.insertQuestion(args)
                            
                            toast("Question Added Successfully")

                        }}> Submit </button>
                        <BiReset className="text-primary h-[30px] w-auto mt-5 flex-5 cursor-pointer" onClick={()=>{
                            setSelectedType("Short")
                            setOptions([{"value":""}])
                            setQuestion("")
                            setTaxonomy("")
                            setSelectedCOList("")
                            setSelectedUnit("")
                            setShowImage("")
                        }}/>
                    </div>
                    
                </div>
                
            </div>
            <ToastContainer 
                bodyClassName="toastBody"
                transition={Slide}
                position="bottom-center"
                autoClose={500}
                hideProgressBar={true}
                closeOnClick
                rtl={false}
                />
    </div>)


}
