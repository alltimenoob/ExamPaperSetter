import TitleBar from "./TitleBar";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { default as Select, components } from "react-select";
import { AiFillPlusCircle } from "react-icons/ai";
import {GoSettings} from "react-icons/go"
import { IoIosPaper } from "react-icons/io";

export default function GeneratePaper() {
  const date = new Date();

  const CourseID = new URLSearchParams(window.location.search).get("course_id");

  const YearList = [
    { label: "First", value: 0 },
    { label: "Second", value: 1 },
    { label: "Third", value: 2 },
    { label: "Fourth", value: 3 },
  ];

  const StreamList = [
    { label: "B.Tech", value: 0 },
    { label: "M.Tech", value: 1 },
    { label: "PDDC", value: 2 },
  ];

  const SemesterList = [
    { label: "Odd", value: 0 },
    { label: "Even", value: 1 },
  ];

  const ExamTypeList = [
    { label: "1st Mid Semester Examination", value: 0 },
    { label: "2nd Mid Semester Examination", value: 1 },
    { label: "End Semester Examination", value: 2 },
  ];
  const [Page, setPage] = useState("MetaData");

  const [CourseOutcomeList, setCourseOutcomeList] = useState([{ value: "" }]);
  const [UnitsList, setUnitsList] = useState([{ value: "" }]);
  const [TaxonomyList, setTaxonomyList] = useState([{}]);
  const [TypeList, setTypeList] = useState([{}]);
  const [QuestionsList, setQuestionsList] = useState([{}]);
  const [Instructions, setInstructions] = useState([]);

  const [SelectByUnit, setSelectByUnit] = useState(false);

  const [SelectedCOList, setSelectedCOList] = useState([]);
  const [SelectedUnitList, setSelectedUnitList] = useState([]);

  const [CurrentMarks,setCurrentMarks] = useState(0)

  const [TotalMarks, setTotalMarks] = useState("");
  const [Year, setYear] = useState("");
  const [Stream, setStream] = useState("");
  const [AY, setAY] = useState(
    "AY " + date.getFullYear() + "-" + (date.getYear() + 1 - 100)
  );
  const [Semester, setSemester] = useState("");
  const [ExamDate, setExamDate] = useState("");
  const [StartTime, setStartTime] = useState("00:00");
  const [EndTime, setEndTime] = useState("00:00");
  const [ExamType, setExamType] = useState("");

  const [QDetails, setQDetails] = useState([]);

  useEffect(() => {
    const taxonomy = window.api.getTaxonomy(CourseID);
    const co = window.api.getCOs(CourseID);
    const units = window.api.getUnits(CourseID);
    const types = window.api.getQuestionTypes(CourseID);

    Promise.all([taxonomy, co, units, types]).then((values) => {
      setUnitsList(
        values[2].units.map((value) => {
          return {
            label: "Unit : " + value.unit_name,
            value: value.unit_id.toString(),
          };
        })
      );
      setCourseOutcomeList(
        values[1].cos.map((value) => {
          return {
            label: "CO : " + value.course_outcomes_description,
            value: value.course_outcomes_number,
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

    

    const questions = window.api.getQuestions({ course_id: CourseID });

    questions.then((result) => {

      setQuestionsList(
        result.map((value) => {
          value.value = value.question_id;
          value.label = value.question_text;
          delete value.question_id;
          delete value.question_text;

          return value;
        })
      );
    });
  }, [CourseID]);

  const component = (props) => {
    return (
      <div className="p-0">
        <components.Option {...props}>
          <div className="flex flex-col items-center justify-around text-[14px] ">
		
            <span
              className="self-start font-bold m-2 text-start ml-2"
              checked={props.isSelected}
              onChange={() => null}
            >
              {props.label}
            </span>
            <div className="ml-[5px] mt-[2px] self-start flex items-center text-black font-bold gap-2 text-[10px] ">
              <span className="bg-red-400 rounded p-[2px]">
                Marks {props.data.marks}
              </span>
              <span className="bg-green-400 rounded p-[2px]">
                Taxonomy {props.data.taxonomy_letter}
              </span>

              <span className="bg-pink-400 rounded text-center p-[2px] w-[50px]">
                {props.data.question_type_name}
              </span>

              <div className="flex gap-2 rounded bg-blue-400 p-[2px] pr-[4px]">
                <span>COs</span>
                {props.data.cource_outcomes.map((value, i) => {
                  return <span key={i}>{value.course_outcomes_number}</span>;
                })}
              </div>
            </div>
          </div>
        </components.Option>
      </div>
    );
  };

  return (
    <div className="App">
      <TitleBar
        name={"Generate Paper"}
        close={true}
        max={true}
        min={true}
        window="mainWindow"
      />

      <IoArrowBackCircleOutline
        className="absolute left-0 top-8 w-9 h-9 text-white  overflow-auto"
        onClick={() => {
          if (Page === "Questions") setPage("MetaData");
          else window.api.goBack();
        }}
      />

    {Page==="Questions" && <GoSettings
        className="absolute left-0 top-24 p-[3px] w-9 h-9 text-white overflow-auto"
        onClick={() => {
          
        }}
      />}


      <div className="absolute mt-8 p-5 left-10 right-0 w-90 h-screen overflow-y-scroll bg-white flex flex-col items-start">
        {Page === "MetaData" && (
          <div className="w-full pb-10 h-full bg-white">
            <span className=" self-start text-xl"> Meta Data </span>

            <div className="mt-5 w-full gap-2 grid grid-flow-row grid-cols-2">
              <span className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                <Select
                  placeholder={"Select Year"}
                  options={YearList}
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  onChange={(value) => {
                    setYear(value);
                  }}
                  allowSelectAll={true}
                  value={Year}
                />
              </span>

              <span className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                <Select
                  placeholder={"Select Stream"}
                  options={StreamList}
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  onChange={(value) => {
                    setStream(value);
                  }}
                  allowSelectAll={true}
                  value={Stream}
                />
              </span>

              <span className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                <Select
                  placeholder={"Select Exam Type"}
                  options={ExamTypeList}
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  onChange={(value) => {
                    setExamType(value);
                  }}
                  allowSelectAll={true}
                  value={ExamType}
                />
              </span>

              <span className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                <Select
                  placeholder={"Select Semester"}
                  options={SemesterList}
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  onChange={(value) => {
                    setSemester(value);
                  }}
                  allowSelectAll={true}
                  value={Semester}
                />
              </span>

              <input
                type="text"
                value={AY}
                onChange={(event) => {
                  setAY(event.currentTarget.value);
                }}
                className="TextBox w-full"
                placeholder="Enter Acadamic Year (2020-21)"
              />

              <input
                type="text"
                value={ExamDate}
                onChange={(event) => {
                  setExamDate(event.currentTarget.value);
                }}
                onFocus={(event) => {
                  event.currentTarget.type = "date";
                }}
                className="TextBox w-full"
                placeholder="DD.MM.YYYY"
              />

              <div className="flex h-[38px] justify-center items-center">
                <span className="text-[16px] w-[50px] p-1 text-white bg-primary rounded">
                  From
                </span>
                <input
                  type="time"
                  value={StartTime}
                  min="00:00"
                  max="23:59"
                  onChange={(event) => {
                    setStartTime(event.currentTarget.value);
                  }}
                  className="ml-2 TextBox w-full"
                  placeholder="Enter Start Time"
                />
              </div>

              <div className="flex h-[38px] justify-center items-center">
                <span className="text-[16px] w-[50px] p-1 text-white bg-primary rounded">
                  To
                </span>
                <input
                  type="time"
                  value={EndTime}
                  min="00:00"
                  max="23:59"
                  step="60"
                  onChange={(event) => {
                    setEndTime(event.currentTarget.value);
                  }}
                  className="ml-2 TextBox w-full"
                  placeholder="Enter End Time"
                />
              </div>

              <input
                type="number"
                onWheel={(event) => {
                  event.currentTarget.blur();
                }}
                value={TotalMarks}
                onChange={(event) => {
                  setTotalMarks(event.currentTarget.value);
                }}
                className="TextBox w-full"
                placeholder="Enter Total Marks"
              />
            </div>

            <div className="mt-5 w-full flex flex-col gap-2 h-min pb-20">
              <span className="mt-5 self-center text-xl">
                Additional Instructions{" "}
              </span>

              <div className="mt-5 w-full flex flex-col gap-2 h-min ">
                {Instructions.map((value, index) => (
                  <input
                    type="text"
                    className="TextBox mb-2 w-full"
                    key={index}
                    id={index}
                    value={value.value}
                    onChange={(event) => {
                      let list = [...Instructions];
                      list = list.map((value) => {
                        if (
                          value.id.toString() === event.target.id.toString()
                        ) {
                          value.value = event.currentTarget.value;
                        }
                        return value;
                      });
                      setInstructions(list);
                    }}
                    placeholder={`Instructions ${index + 1}`}
                  />
                ))}

                <AiFillPlusCircle
                  className="m-auto h-[28px] text-primary cursor-pointer"
                  onClick={() => {
                    setInstructions([
                      ...Instructions,
                      { value: "", id: Instructions.length },
                    ]);
                  }}
                />
                <button
                  className="Button w-[150px] z-40 fixed bottom-5 right-7"
                  onClick={(event) => {
                    setPage("Questions");
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {Page === "Questions" && (
          <div className="w-full h-screen  ">
            
            <div className="mt-2 w-full flex flex-col gap-2">
              

              {SelectByUnit && (
                <span className="w-full p-0 text-[16px] text-start border-b-2 border-b-primary">
                  <Select
                    placeholder={"Select Unit"}
                    options={UnitsList}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isMulti
                    onChange={(value) => {
                      setSelectedUnitList(value);
                      setSelectedCOList([]);
                    }}
                    allowSelectAll={true}
                    value={SelectedUnitList}
                  />
                </span>
              )}
            </div>

            <span className="self-start text-xl"> Questions </span>
            <span className={`fixed top-10 right-4 self-start text-xl ${(TotalMarks >= CurrentMarks) ? "bg-primary " : "bg-red-500 animate-[pulse_1s_ease-in_infinite] " } p-1  text-white font-bold rounded`}> 
              Total Marks  {CurrentMarks} 
            </span>
            <div className="mt-2 w-full h-fit flex flex-col justify-center gap-2 ">
              {QDetails.map((value, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col w-full items-center justify-center  border-b-primary border-2"
                  >
                    <div className="flex w-full justify-start items-center">
                      <span className="ml-2 text-[16px] ">Q.{i + 1}</span>
                      {value.showText && (
                        <input
                          id={"I" + i}
                          type="text"
                          className="TextBox m-2 w-full flex-1"
                          value={value.text.label}
                          onChange={(event) => {
                            const temp = [...QDetails];

                            setQDetails(
                              temp.map((value, i) => {
                                if ("I" + i === event.currentTarget.id) {
                                  value.text.label = event.currentTarget.value;
                                }
                                return value;
                              })
                            );
                          }}
                          placeholder="Enter Question"
                        />
                      )}

                      {!value.showText && (
                        <span className="w-full flex-1 p-0 text-[16px] m-2 text-start ">
                          <Select
                            name={"Q" + i}
                            placeholder={"Select Question"}
                            options={QuestionsList}
                            hideSelectedOptions={true}
                            components={{ Option: component }}
                            onChange={(text, event) => {
                              var temp = [...QDetails];
                              var tempMarks  = 0;

                              temp = temp.map((value, i) => {
                                if (event.name === "Q" + i) {
                                  value.marks = text.marks
                                  value.text = text;
                                }
                                tempMarks += value.marks
                                return value;
                              })

                              setCurrentMarks(tempMarks)

                              setQDetails(temp);
                            }}
                            value={value.text}
                          />
                        </span>
                      )}

                      <input
                        type="checkbox"
                        id={"T" + i}
                        className="Button m-2 flex-2 "
                        onClick={(event) => {
                          const temp = [...QDetails];
                          var tempMarks  = 0;

                          setQDetails(
                            temp.map((value, i) => {

                              if ("T" + i === event.currentTarget.id) {
                                value.text = { label: "", value: 0  ,marks : 0};
                                value.showText = !value.showText;
                               
                                if(!value.showText)
                                {
                                  value.subq = []
                                }
                                value.marks = 0
                              }

                              tempMarks += parseInt(value.marks+"")
                             
                              return value;
                            })
                          )

                          
                          setCurrentMarks(tempMarks)
                        
                        }}
                      />

                      <label htmlFor={"T" + i} className="text-[16px] flex-3">
                        Select Question
                      </label>
                    </div>

                   
                    <div className="flex flex-col w-[60vw]">
                      {value.subq.map((value, i1) => {
                        return (
                          <span
                            key={i1}
                            className="w-full p-0 text-[16px] m-2 text-start flex-1"
                          >
                            <Select
                              name={i + " " + i1}
                              placeholder={"Select Question"}
                              options={QuestionsList}
                              hideSelectedOptions={true}
                              components={{
                                Option: component,
                              }}
                              onChange={(text, event) => {
                                var temp = [...QDetails];
                                var tempCurrentMarks = 0;

                                temp = temp.map((value, i2) => {

                                  var tempMarks = value.marks
                                  const ids = event.name.split(" ");

                                  if (parseInt(ids[0]) === i2) {
                                    const sq = [...value.subq];
                                    sq[parseInt(ids[1])] = text;
                                    value.subq = sq;
                                  }

                                  if(value.showText)
                                  {
                                    tempMarks = 0
                                    value.subq.forEach((value)=>{
                                      tempMarks += value.marks
                                    })
                                  }

                                  value.marks = tempMarks
                                  tempCurrentMarks += value.marks
                                  return value;
                                })

                                setCurrentMarks(tempCurrentMarks)

                                setQDetails(temp)
                                
                              }}
                              value={value}
                            />
                          </span>
                        );
                      })}
                    </div>
                    {value.showText && (
                      <AiFillPlusCircle
                        className="text-primary m-2"
                        id={"P" + i}
                        onClick={(event) => {
                          const temp = [...QDetails];
                          setQDetails(
                            temp.map((value, i) => {
                              if (event.currentTarget.id === "P" + i) {
                                value.subq = [
                                  ...value.subq,
                                  { label: "", value: "" ,marks:0},
                                ];
                              }

                              return value;
                            })
                          );
                        }}
                      />
                    )}
                  </div>
                );
              })}

              <button
                className="w-[250px]  mb-10  self-center Button"
                onClick={() => {
                  const temp = [...QDetails];

                  temp.push({
                    filter: {
                      marks: [],
                      taxonomy: [],
                      type: [],
                    },
                    marks:0,
                    showFilter: false,
                    showText: true,
                    text: { label: ``, value: -1, marks: 0 },
                    subq: [],
                  });

                  setQDetails(temp);
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <AiFillPlusCircle /> Add New Question
                </div>
              </button>

              <button
                className="flex items-center gap-2 justify-center Button bg-primary text-white fixed w-[80px] h-[60px] bottom-10 right-10 "
                onClick={() => {
                  window.api.getCourseFromID(CourseID).then((value) => {
                    let endTime = EndTime.split(":");
                    let startTime = StartTime.split(":");

                    if (parseInt(endTime[0]) > 12) {
                      endTime =
                        (parseInt(endTime[0]) % 13) + ":" + endTime[1] + " PM";
                    } else {
                      endTime = endTime[0] + ":" + endTime[1] + " AM";
                    }

                    if (parseInt(startTime[0]) > 12) {
                      startTime =
                        (parseInt(startTime[0]) % 12) +
                        ":" +
                        startTime[1] +
                        " PM";
                    } else {
                      startTime = startTime[0] + ":" + startTime[1] + " AM";
                    }

                    console.log(QDetails);

                    window.api.rateTex({
                      MetaData: {
                        CourseCode: value.code,
                        CourseName: value.name,
                        TotalMarks: TotalMarks,
                        Year: Year.label,
                        Stream: Stream.label,
                        AY: AY,
                        ExamType: ExamType.label,
                        Semester: Semester.label,
                        Date: ExamDate.split("-").join("."),
                        Time: startTime + " to " + endTime,
                        Instructions: Instructions,
                      },
                      QuestionDetails: QDetails,
                    });
                  });
                }}
              >
                <IoIosPaper />{" "}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

