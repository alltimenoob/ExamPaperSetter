import { useState } from "react"
import TitleBar from "./TitleBar"
import {AiFillPlusCircle} from "react-icons/ai"
import {default as Select,components} from 'react-select';

export default function AddQuestion(){

    const [SelectUnit,setSelectUnit] = useState(true)
    const [SelectedType,setSelectedType] = useState("MCQ")
    const [Options,setOptions] = useState([{"value":""}])
    const [Question,setQuestion] = useState("")
    const [Taxonomy,setTaxonomy] = useState("A")
    
    const [CourseOutcomeList,setCourseOutcomeList] = useState([{"label":"CO 1","value":"1"},{"label":"CO 2","value":"2"}]);
    const [UnitsList,setUnitsList] = useState([{"label":"Unit 1","value":"1"},{"label":"Unit 2","value":"2"}]);
    const [TypeList,setTypeList] = useState([{"value":"MCQ"},{"value":"Short"}])
    const [TaxonomyList,setTaxonomyList] = useState([{"value":"Apply"},{"value":"Analyze"}])

    const [SelectedCOList,setSelectedCOList] = useState([])
    const [SelectedUnitList,setSelectedUnitList] = useState([])
    const [ShowImage,setShowImage] = useState(false)

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
            
            <div className='mt-8 w-screen h-screen bg-white flex items-start'>
                <div className="m-5 flex flex-col gap-2 w-screen h-screen">
                    
                    <select className="TextBox w-full" value={SelectedType} 
                        onChange={(event)=>{
                            setSelectedType(event.currentTarget.value)
                            console.log(event.currentTarget.value)
                        }} id="types">
                        {TypeList.map((value,index)=>{
                            return(<option key={index} value={value.value}>{value.value}</option>)
                        })}
                        
                    </select>

                    <label className="TextBox w-full flex items-center">
                        <input type="checkbox" value={SelectUnit} onChange={()=>{setSelectUnit(!SelectUnit)}}  />
                        <span className="ml-5">Choose Units?</span>
                    </label>


                    <select className="TextBox w-full" id="types" value={Taxonomy} 
                    onChange={(event)=>{
                        setTaxonomy(event.currentTarget.value)
                    }}>
                        {TaxonomyList.map((value,index)=>{
                            return(<option key={index} value={value.value}>{value.value}</option>)
                        })}
                    </select>
                    
                    {SelectUnit&&<span
                        className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary"
                        data-toggle="popover"
                        data-trigger="focus"
                        data-content="">

                        <Select
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
                    </span>}


                    {!SelectUnit&&<span
                        className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary"
                        data-toggle="popover"
                        data-trigger="focus"
                        data-content="">

                        <Select
                            options={UnitsList}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{
                                Option : component
                            }}
                            onChange={(list)=>{setSelectedUnitList(list); console.log(list)}}
                            allowSelectAll={true}
                            value={SelectedUnitList}
                            />
                    </span>}
                  

                    
                    <input type="text" className="TextBox w-full" value={Question}
                    onChange={(event)=>{
                        setQuestion(event.currentTarget.value)
                    }} placeholder="Enter Question"/>     

                    {SelectedType==="MCQ"&&<div className="grid w-full grid-flow-col grid-cols-6">
                        
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

                    <input type="number" className="TextBox w-full" placeholder="Enter Marks"/>                 

                    <label className="TextBox w-full flex items-center justify-start">
                        <input type="checkbox" onChange={()=>{setShowImage(!ShowImage)}}/>
                        <span className="ml-2">Attach Image?</span>
                    </label> 
                    

                    {ShowImage&&<label className="Button w-full flex items-center justify-center">
                        <input type="file" className="hidden"/>
                        <span>Select Image</span>
                    </label> }


                    <button className="Button mt-5"> Submit </button>
                    
                </div>
                
            </div>

    </div>)


}