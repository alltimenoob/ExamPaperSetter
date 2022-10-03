import {BiEdit} from "react-icons/bi"
import {RiDeleteBin5Line} from "react-icons/ri"

export default function QuestionCard(props){
    if(props.data.cource_outcomes===undefined )
        return(<p></p>)
    
    return(
        <div key={props.index} className="relative  m-2  flex border-2 rounded-md
         p-3 flex-col items-center justify-around bg-primary text-white
         text-[14px] ">
            
            <BiEdit className="absolute top-3 right-5 w-[25px] h-[25px] hover:text-green-200 cursor-pointer" />
            <RiDeleteBin5Line className="absolute top-12 right-5 w-[25px] h-[25px] hover:text-green-200 cursor-pointer" />

            <span
              className="self-start font-bold  text-start m-2 mr-10">
              {props.data.label} 
            </span>
            <div className="m-2 self-start flex items-center  font-bold gap-2 text-[14px] ">
              <span className="bg-red-400 rounded p-[2px] w-[100px]">
                Marks {props.data.marks}
              </span>
              <span className="bg-green-600 rounded p-[2px] w-[100px]">
                Taxonomy {props.data.taxonomy_letter}
              </span>

              <span className="bg-pink-400 rounded text-center p-[2px] w-[100px]">
                {props.data.question_type_name}
              </span>

              <div className="flex gap-2 rounded items-center justify-center bg-blue-400 p-[2px] w-[100px]">
                <span>COs</span>
                {props.data.cource_outcomes.map((value,i)=>{
                    return <span key={i}>{value.course_outcomes_number}</span> 
                })}
                
              </div>
            </div>

        </div>
    )
}