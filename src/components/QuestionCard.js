import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function QuestionCard(props) {
  const navigate = useNavigate("");

  if (props.data.cource_outcomes === undefined) return <p></p>;

  return (
    <div
      key={props.data.value}
      className="relative  m-2  flex border-2 rounded-md
         p-3 flex-col items-center justify-around bg-primary text-white
         text-[14px] "
    >
      <BiEdit
        onClick={() => {
          const cource_outcomes = props.data.cource_outcomes.map((value) => {
            value.label = value.course_outcomes_description;
            value.value = value.course_outcomes_id;

            delete value.course_outcomes_description;
            delete value.course_outcomes_id;

            return value;
          });
          if (props.data.mcqs !== undefined) {
            props.data.mcqs = props.data.mcqs.map((value) => {
              value.label = value.option_text;
              value.id = value.mcq_option_id;

              delete value.option_text;
              delete value.mcq_option_id;
              delete value.question_id;

              return value;
            });
          }
          props.data.cource_outcomes = cource_outcomes;

          navigate("/ModifyQuestion", {
            state: props.data,
          });
        }}
        className="absolute top-3 right-5 w-[25px] h-[25px] hover:text-green-200 cursor-pointer"
      />

      <RiDeleteBin5Line
        id={props.data.value}
        className="absolute top-12 right-5 w-[25px] h-[25px] hover:text-green-200 cursor-pointer"
        onClick={(event) => {
          const options = {
            window: "mainWindow",
            options: {
              type: "warning",
              buttons: ["Ok", "Cancel"],
              title: "Alert",
              message: "Are you sure?",
              detail:
                "Selected question will be deleted. Press cancel to prevent the deletion.",
            },
          };

          const callback = async (id) => {
            const result = await window.api.showDialog(options);

            if (result.response === 0) {
              const result = await window.api.deleteQuestion(id);

              if (result) {
                props.callback(parseInt(id), "delete");
              }
            }

            /**/
          };

          callback(event.currentTarget.id);
        }}
      />

      <span className="self-start font-bold  text-start m-2 mr-10">
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
          {props.data.cource_outcomes.map((value, i) => {
            return <span key={i}>{value.course_outcomes_number}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
