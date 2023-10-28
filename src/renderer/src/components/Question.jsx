import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*  List To Display Elements */

function QuestionsList(props) {
  if (props.list === (null || undefined)) return <p>List Loading</p>;

  return (
    <div className="m-5 grid grid-flow-row auto-rows-min h-full w-full overflow-scroll gap-1">
      {props.list.map((value, i) => {
        return <QuestionCard key={i} data={value} callback={props.callback} />;
      })}
    </div>
  );
}

/* Single Element Of List */

function QuestionCard(props) {
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

/* For Filtering The Questions / Icon Present In Sidebar */

function QuestionFilter(props) {
  const CourseID = props.CourseID;

  var SelectedFilter = props.SelectedFilter;

  const [CourseOutcomeList, setCourseOutcomeList] = useState([{ value: "" }]);
  const [UnitsList, setUnitsList] = useState([{ value: "" }]);
  const [TaxonomyList, setTaxonomyList] = useState([{}]);
  const [TypeList, setTypeList] = useState([{}]);

  const calculateFilter = props.Callback;

  useEffect(() => {
    const getFilterDetails = async () => {
      const taxonomy = window.api.getTaxonomy(CourseID);
      const co = window.api.getCourseOutcomes(CourseID);
      const units = window.api.getUnits(CourseID);
      const types = window.api.getQuestionTypes(CourseID);

      await Promise.all([taxonomy, co, units, types]).then((values) => {
        setUnitsList(
          values[2].data.map((value) => {
            return {
              label: value.unit_name,
              value: value.unit_id,
            };
          })
        );
        setCourseOutcomeList(
          values[1].data.map((value) => {
            return {
              label: value.course_outcomes_description,
              value: value.course_outcomes_id,
            };
          })
        );
        setTaxonomyList(
          values[0].taxonomy.map((value) => {
            return {
              label: value.taxonomy_name,
              value: value.taxonomy_id,
              percentage: 0,
            };
          })
        );
        setTypeList(
          values[3].question_types.map((value) => {
            return {
              label: value.question_type_name,
              value: value.question_type_id,
            };
          })
        );
      });
    };

    getFilterDetails();
  }, [CourseID]);

  return (
    <div
      className={` ${props.ShowFilter ? `visible ` : `invisible`
        } p-1 absolute top-24 z-50 h-[300px] w-[300px] items-start justify-start rounded-lg shadow-lg text-white font-bold left-11 bg-primary`}
    >
      <span>Select Filter</span>

      <div className="flex gap-2 p-2 text-primary overflow-x-scroll w-full filter  ">
        {CourseOutcomeList.map((value, i) => {
          return (
            <span
              key={i}
              className="flex-none bg-white p-1 rounded min-w-[50px] w-max text-[12px] cursor-pointer"
              onClick={(event) => {
                if (
                  event.currentTarget.style.backgroundColor ===
                  "rgb(221, 83, 83)"
                ) {
                  event.currentTarget.style =
                    "background-color:white;color:rgb(28 103 88) ";
                  const temp = SelectedFilter;
                  const index = temp.course_outcomes.indexOf(value.value);
                  temp.course_outcomes.splice(index, 1);
                  console.log(temp);
                  calculateFilter(temp);
                } else {
                  event.currentTarget.style =
                    "background-color:rgb(221, 83, 83); color:white ";
                  const temp = SelectedFilter;
                  temp.course_outcomes.indexOf(value.value) === -1
                    ? temp.course_outcomes.push(value.value)
                    : console.log();
                  console.log(temp);
                  calculateFilter(temp);
                }
              }}
            >
              CO : {value.label}
            </span>
          );
        })}
      </div>

      <div className="flex gap-2 p-2 text-primary overflow-x-scroll w-full filter  ">
        {UnitsList.map((value, i) => {
          return (
            <span
              key={i}
              className="bg-white p-1 rounded min-w-[50px] w-max text-[12px] cursor-pointer"
              onClick={(event) => {
                if (
                  event.currentTarget.style.backgroundColor ===
                  "rgb(221, 83, 83)"
                ) {
                  event.currentTarget.style =
                    "background-color:white; color:rgb(28 103 88) ";
                  const temp = SelectedFilter;
                  const index = temp.units.indexOf(value.value);
                  temp.units.splice(index, 1);
                  console.log(temp);

                  calculateFilter(temp);
                } else {
                  event.currentTarget.style =
                    "background-color:rgb(221, 83, 83); color:white ";
                  const temp = SelectedFilter;
                  temp.units.indexOf(value.value) === -1
                    ? temp.units.push(value.value)
                    : console.log();
                  console.log(temp);

                  calculateFilter(temp);
                }
              }}
            >
              Unit : {value.label}
            </span>
          );
        })}
      </div>

      <div className="flex  gap-2 p-2 text-primary overflow-x-scroll w-full filter  ">
        {TypeList.map((value, i) => {
          return (
            <span
              key={i}
              className="bg-white p-1 rounded  min-w-[50px] w-max  text-[12px] cursor-pointer"
              onClick={(event) => {
                if (
                  event.currentTarget.style.backgroundColor ===
                  "rgb(221, 83, 83)"
                ) {
                  event.currentTarget.style =
                    "background-color:white; color:rgb(28 103 88) ";
                  const temp = SelectedFilter;
                  const index = temp.types.indexOf(value.value);
                  temp.types.splice(index, 1);
                  console.log(temp);
                  calculateFilter(temp);
                } else {
                  event.currentTarget.style =
                    "background-color:rgb(221, 83, 83); color:white ";
                  const temp = SelectedFilter;
                  temp.types.indexOf(value.value) === -1
                    ? temp.types.push(value.value)
                    : console.log();
                  console.log(temp);
                  calculateFilter(temp);
                }
              }}
            >
              {value.label}
            </span>
          );
        })}
      </div>

      <div className="flex  gap-2 p-2 text-primary overflow-x-scroll w-full filter  ">
        {TaxonomyList.map((value, i) => {
          return (
            <span
              key={i}
              className="bg-white p-1 rounded  min-w-[50px] w-max text-[12px] cursor-pointer"
              onClick={(event) => {
                if (
                  event.currentTarget.style.backgroundColor ===
                  "rgb(221, 83, 83)"
                ) {
                  event.currentTarget.style =
                    "background-color:white; color:rgb(28 103 88) ";
                  const temp = SelectedFilter;
                  const index = temp.taxonomies.indexOf(value.value);
                  temp.taxonomies.splice(index, 1);
                  console.log(temp);

                  calculateFilter(temp);
                } else {
                  event.currentTarget.style =
                    "background-color:rgb(221, 83, 83); color:white ";
                  const temp = SelectedFilter;
                  temp.taxonomies.indexOf(value.value) === -1
                    ? temp.taxonomies.push(value.value)
                    : console.log();
                  console.log(temp);

                  calculateFilter(temp);
                }
              }}
            >
              {value.label !== undefined
                ? value.label.toUpperCase()
                : value.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export { QuestionFilter, QuestionsList };
