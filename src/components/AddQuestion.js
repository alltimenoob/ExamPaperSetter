import { useState } from "react"
import TitleBar from "./TitleBar"
import {AiFillPlusCircle} from "react-icons/ai"

export default function AddQuestion(){

    const [SelectUnit,setSelectUnit] = useState(true)
    const [SelectedType,setSelectedType] = useState("MCQ")
    const [Options,setOptions] = useState([{"value":""}])
    const [Question,setQuestion] = useState("")

    return(
        <div className="App">
            <TitleBar name={"Add Questions"} close={true} max={true} min={true} window="mainWindow"/>
            
            <div className='mt-8 w-screen h-screen bg-white flex items-start'>
                <div className="m-5 flex flex-col gap-2 w-screen h-screen">
                    
                    <select className="TextBox" value={SelectedType} 
                        onChange={(event)=>{
                            setSelectedType(event.currentTarget.value)
                            console.log(event.currentTarget.value)
                        }} id="types">
                        <option value="MCQ">MCQ</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>

                    <label className="TextBox flex items-center">
                        <input type="checkbox" value={SelectUnit} onChange={()=>{setSelectUnit(!SelectUnit)}}  />
                        <span className="ml-5">Choose Units?</span>
                    </label>

                    {!SelectUnit&&<select className="TextBox" id="types">
                        <option value="volvo">Unit:1</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>}


                    {SelectUnit&&<select className="TextBox" id="types">
                        <option value="volvo">CO:1</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>}
                    
                    <input type="text" className="TextBox" value={Question}
                    onChange={(event)=>{
                        setQuestion(event.currentTarget.value)
                    }} placeholder="Enter Question"/>     

                    {SelectedType==="MCQ"&&<div className="grid grid-flow-col grid-cols-6">
                        
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

                    <input type="number" className="TextBox" placeholder="Enter Marks"/>                 


    

                    <label className="Button w-[250px] flex items-center justify-center">
                        <input type="file" className="hidden"/>
                        <span>Select Image</span>
                    </label> 
                </div>
                
            </div>

    </div>)


}