import TitleBar from "../components/TitleBar";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { default as Select, components } from "react-select";
import { AiFillPlusCircle, AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { GoSettings } from "react-icons/go";


/* -- For PDF -- */
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
/* ------- */

import { QuestionFilter } from "../components/Question";
import { useLocation } from "react-router-dom";

export default function GeneratePaper() {
  const date = new Date();

  const location = useLocation()

  const CourseID = location.state

  const [ExamPaper, setExamPaper] = useState({
    sections: [[],[]]
  })

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
  const [ShowFilter, setShowFilter] = useState(false);

  const [QuestionsList, setQuestionsList] = useState([{}]);
  const [FilteredList, setFilteredList] = useState([{}]);
  const [SelectedList, setSelectedList] = useState([{}]);

  const [Instructions, setInstructions] = useState([]);

  const [CurrentMarks, setCurrentMarks] = useState(0);

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
  const [CurrentSection,setCurrentSection] = useState(0)

  useEffect(() => {
    const getQuestions = async () => {
      var questions = await window.api.getQuestions({ course_id: CourseID });

      questions = questions.map((value) => {
        value.value = value.question_id
        value.label = value.question_text

        delete value.question_id
        delete value.question_text
        value.subq = []
        return value;
      });
      setQuestionsList(questions);
      setFilteredList(questions);
      setSelectedList(questions)
    };

    getQuestions();
  }, [CourseID]);

  const [SelectedFilter, setSelectedFilter] = useState({
    course_outcomes: [],
    types: [],
    taxonomies: [],
    units: [],
  });

  const calculateFilter = (filterList) => {
    setSelectedFilter(filterList);

    var temp = [...QuestionsList];

    if (filterList.course_outcomes.length > 0) {
      temp = temp.filter((value) => {
        return value.cource_outcomes.some((co) =>
          filterList.course_outcomes.includes(co.course_outcomes_id)
        );
      });
    }

    if (filterList.units.length > 0) {
      temp = temp.filter((question) => {
        return filterList.units.includes(question.unit_id);
      });
    }

    if (filterList.types.length > 0) {
      temp = temp.filter((question) => {
        return filterList.types.includes(question.question_type_id);
      });
    }

    if (filterList.taxonomies.length > 0) {
      temp = temp.filter((question) => {
        return filterList.taxonomies.includes(question.taxonomy_id);
      });
    }


    setFilteredList(temp)
    calculateSelectedQuestions({...ExamPaper},temp)
  };

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const [file, setFile] = useState(null);

  const calculateSelectedQuestions = (tempExamPaper, filterList = FilteredList) => {
    let selectedQuestions = []
    tempExamPaper.sections.forEach((tempQDetails)=>{
      tempQDetails.forEach(question => {
        if (question.subq.length > 0) {
          question.subq.forEach(question => {
            if (question.subq.length > 0) {
              question.subq.forEach(question => {
                if (question.value !== undefined)
                  selectedQuestions.push(question.value)
              })
            }
            else {
              if (question.value !== undefined)
                selectedQuestions.push(question.value)
            }
          })
        }
        else {
          if (question.value !== undefined)
            selectedQuestions.push(question.value)
        }
      });
    })

    const temp = filterList.filter(question => !selectedQuestions.includes(question.value))
    
    setSelectedList(temp)
  }

  const calculateMarks = (tempQDetails) => {
    setCurrentMarks(tempQDetails.reduce((accumlator, question) => accumlator + question.text.marks, 0))
  }

  const handleRemove = (id, marks) => {
    let tempQDetails = [...QDetails]
    switch (Object.keys(id).length) {
      case 1:
        tempQDetails = tempQDetails.filter((_, i) => i !== id.mainIterator)
        break;
      case 2:
        tempQDetails[id.mainIterator].text.marks -= marks
        tempQDetails[id.mainIterator].subq = tempQDetails[id.mainIterator].subq.filter((_, i) => i !== id.subIterator)
        break;
      case 3:
        tempQDetails[id.mainIterator].text.marks -= marks
        tempQDetails[id.mainIterator].subq[id.subIterator].text.marks -= marks
        tempQDetails[id.mainIterator].subq[id.subIterator].subq = tempQDetails[id.mainIterator].subq[id.subIterator].subq.filter((_, i) => i !== id.sub2xIterator)
        break;
      default: break;
    }
    calculateMarks(tempQDetails)
    setQDetails(tempQDetails)
    let tempExamPaper = {...ExamPaper}
    tempExamPaper.sections[CurrentSection] = tempQDetails
    setExamPaper(tempExamPaper)
    calculateSelectedQuestions(tempExamPaper)
  }

  const handleQuestionChange = (value, id) => {
    let tempQDetails = [...QDetails]
    switch (Object.keys(id).length) {
      case 1:
        tempQDetails = tempQDetails.map((main, i) => {
          if (i === id.mainIterator)
            main = {
              ...value, text: {
                label: value.label,
                value: value.value,
                marks: value.marks
              }
            }

          return main
        })
        break;
      case 2:
        tempQDetails[id.mainIterator].subq = tempQDetails[id.mainIterator].subq.map((sub, i) => {
          if (i === id.subIterator)
            sub = {
              ...value, text: {
                label: value.label,
                value: value.value,
                marks: value.marks
              }
            }

          return sub
        })
        tempQDetails[id.mainIterator].text.marks = tempQDetails[id.mainIterator].subq.reduce((accumlator,question)=>accumlator+question.text.marks,0)
        break;
      case 3:
        tempQDetails[id.mainIterator].subq[id.subIterator].subq = tempQDetails[id.mainIterator].subq[id.subIterator].subq.map((sub2x, i) => {
          if (i === id.sub2xIterator)
            sub2x = {
              ...value, text: {
                label: value.label,
                value: value.value,
                marks: value.marks
              }
            }
          return sub2x
        })

        tempQDetails[id.mainIterator].subq[id.subIterator].text.marks = tempQDetails[id.mainIterator].subq[id.subIterator].subq.reduce((accumlator,question)=>accumlator+question.text.marks,0)
        tempQDetails[id.mainIterator].text.marks = tempQDetails[id.mainIterator].subq.reduce((accumlator,question)=>accumlator+question.text.marks,0)
        break;
      default: break;
    }

    calculateMarks(tempQDetails)
    setQDetails(tempQDetails)
    let tempExamPaper = {...ExamPaper}
    tempExamPaper.sections[CurrentSection] = tempQDetails
    setExamPaper(tempExamPaper)
    calculateSelectedQuestions(tempExamPaper)
  }

  const handleQuestionTextChange = (value, id) => {
    let tempQDetails = [...QDetails]
    switch (Object.keys(id).length) {
      case 1:
        tempQDetails = tempQDetails.map((main, i) => {
          if (i === id.mainIterator)
            main = { ...main, text: { ...main.text, label: value } }
          return main
        })
        break
      case 2:
        tempQDetails[id.mainIterator].subq = tempQDetails[id.mainIterator].subq.map((sub, i) => {
          if (i === id.subIterator)
            sub = { ...sub, text: { ...sub.text, label: value } }
          return sub
        })
        break
      default: break
    }
    setQDetails(tempQDetails)
    let tempExamPaper = {...ExamPaper}
    tempExamPaper.sections[CurrentSection] = tempQDetails
    setExamPaper(tempExamPaper)
    calculateSelectedQuestions(tempExamPaper)
  }

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
        className="fixed left-0 top-8 w-9 h-9 text-white  overflow-auto"
        onClick={() => {
          if (Page === "Questions") {
            setPage("MetaData");
            setShowFilter(false);
          } else if (Page === "PDF") {
            setPage("Questions");
          } else window.api.goBack();
        }}
      />

      {Page === "Questions" && (
        <GoSettings
          className="absolute left-0 top-24 p-[3px] w-9 h-9 text-white overflow-auto animate-pulse"
          onClick={() => {
            setShowFilter(!ShowFilter);
          }}
        />
      )}

      <QuestionFilter
        CourseID={CourseID}
        ShowFilter={ShowFilter}
        SelectedFilter={SelectedFilter}
        Callback={calculateFilter}
      />

      <div
        onClick={() => {
          setShowFilter(false);
        }}
        className="absolute mt-8 p-5 left-10 right-0 w-90 h-screen overflow-y-scroll  bg-white flex flex-col items-start"
      >
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
          <div className="w-full h-screen ">
            <div className="flex flex-col pb-[45vh]">
              <div className="w-full m-2 flex h-5 justify-between items-center text-xl font-bold text-primary">
                <span className="flex-[2] text-start"> Questions </span>

                {ExamType.value === 2 &&
                  <div className="flex-[1] flex text-primary items-center justify-center">

                    <AiFillCaretLeft onClick={() => {
                      if(CurrentSection !== 1)
                        return
                      
                      const tempExamPaper = {...ExamPaper} 
                      setCurrentSection(0)
                      setQDetails(tempExamPaper.sections[0])
                      calculateMarks(tempExamPaper.sections[0])
                    }} />

                    <AiFillCaretRight onClick={() => {
                      if(CurrentSection !== 0)
                        return
                      
                      const tempExamPaper = {...ExamPaper} 
                      setCurrentSection(1)
                      setQDetails(tempExamPaper.sections[1])
                      calculateMarks(tempExamPaper.sections[1])

                    }} />

                    <p className="text-base font-semibold">Section {CurrentSection + 1}</p>
                  </div>}

                <div className="flex-[2] flex justify-end gap-3 items-center">

                  <span
                    className=  {`text-base ${TotalMarks/2 >= CurrentMarks
                      ? "text-primary "
                      : "text-red-500 animate-[pulse_1s_ease-in_infinite] "
                      }  font-semibold `}

                    onClick={_ => {
                      console.log(ExamPaper)
                    }}
                  >
                    Total Marks {CurrentMarks}
                  </span>

                  {<span
                      className="flex items-center gap-2 justify-center rounded bg-primary text-white font-semibold p-2  hover:shadow-lg hover:shadow-primary/50 hover:transition-all ease-in-out duration-75 "
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


                          window.api.generatePaper({
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
                            ExamPaper,
                          }).then((value) => {
                            console.log(value)
                            window.api.getFile()
                                .then((value) => {
                                  console.log(value)
                                  setFile("data:application/pdf;base64," + value);
                                })
                                .then(() => {
                                  setPage("PDF");
                                });
                          });

                            
                        });
                      }}
                    >
                      Generate
                    </span>}
                </div>
              </div>

              {/* MAIN QUESTION 🔴 */}
              {QDetails.map((mainQuestion, mainIterator) => {
                return <div key={"main" + mainIterator} className="flex flex-col w-full shadow-md m-2 ">
                  <div className="flex-wrap text-[16px] h-full m-1 text-start flex gap-2 p-4 items-stretch justify-center ">
                    {/* That Delete Transition Here 🚇*/}
                    <div className="relative flex-[1] flex font-semibold text-xs rounded border-secondary border-[1px] group">
                      <p className={`flex w-full h-full items-center justify-center 
                      text-primary  group-hover:hidden }`}>
                        Q {mainIterator + 1} </p>
                      <p className={`overflow-hidden flex-[1] flex w-0 h-0 rounded items-center justify-center  
                    text-primary  group-hover:h-full group-hover:w-full group-hover:bg-red-500 
                    group-hover:text-white group-hover:transition-all ease-linear `}
                        onClick={() => handleRemove({ mainIterator }, mainQuestion.text.marks)}>Delete</p>
                    </div>
                    {mainQuestion.subq.length > 0 &&
                      <input
                        id={"main" + mainIterator}
                        type="text"
                        className="TextBox w-full flex-[9]"
                        value={mainQuestion.text.label}
                        onChange={(event) => handleQuestionTextChange(event.currentTarget.value, { mainIterator })}
                        placeholder="Enter Question"
                      />}
                    {mainQuestion.subq.length < 1 && <Select
                      name={"main" + mainIterator}
                      className="flex-[9]"
                      placeholder={"Select Question"}
                      options={SelectedList}
                      hideSelectedOptions={true}
                      components={{
                        Option: component,
                      }}
                      value={mainQuestion.text}
                      onChange={value => handleQuestionChange(value, { mainIterator })}
                    />
                    }
                    <p className="flex-[1] p-[2px] flex items-center justify-center rounded border-primary border-[1px] text-primary">
                      {mainQuestion.text.marks}</p>
                    {/* Generate New Sub Question ⚙ */}
                    <p id={mainIterator} className="flex-[1] p-[2px] flex items-center justify-center font-semibold text-2xl rounded border-primary border-[1px] hover:bg-primary hover:text-white text-primary"
                      onClick={_ => {
                        let tempQDetails = [...QDetails]
                        let id = parseInt(_.currentTarget.id)
                        let subq = tempQDetails[parseInt(_.currentTarget.id)].subq
                        tempQDetails[id] = { text: tempQDetails[id].text, subq: [...subq, { text: { label: "", value: undefined, marks: 0 }, subq: [] }] }
                        tempQDetails[id].text.marks = subq.reduce((accumlator, sub) => sub.text.marks + accumlator, 0)

                        if (tempQDetails[id].subq.length === 1) {
                          tempQDetails[id].text.label = ""
                          calculateMarks(tempQDetails)
                        }
                        setQDetails(tempQDetails)
                      }}>
                      +</p>
                      <p className="basis-full"></p>
                      <img className="max-h-[150px] "src={mainQuestion.question_image} alt=""/>
                  </div>
                  {/* SUB QUESTION 🔴 */}
                  {mainQuestion.subq.map((subQuestion, subIterator) => {
                    return <div key={"sub" + subIterator} className="flex flex-col w-full ">
                      <div className="flex-wrap text-[16px] ml-6 h-full m-1 text-start flex gap-2 p-4 pt-0 items-stretch justify-center">
                        <div className="relative flex-[1] flex font-semibold text-xs rounded border-secondary border-[1px] group">
                          <p className={`flex w-full h-full items-center justify-center 
                        text-primary  group-hover:hidden }`}>
                            {String.fromCharCode(subIterator + 65)} </p>
                          <p className={`overflow-hidden flex-[1] flex w-0 h-0 rounded items-center justify-center  
                      text-primary  group-hover:h-full group-hover:w-full group-hover:bg-red-500 
                      group-hover:text-white group-hover:transition-all ease-linear `}
                            onClick={() => handleRemove({ mainIterator, subIterator }, subQuestion.text.marks)}>Delete</p>
                        </div>
                        {subQuestion.subq.length > 0 ?
                          <input
                            id={subIterator}
                            type="text"
                            className="TextBox w-full flex-[9]"
                            value={subQuestion.text.label}
                            onChange={(event) => handleQuestionTextChange(event.currentTarget.value, { mainIterator, subIterator })}
                            placeholder="Enter Question"
                          />
                          :
                          <Select
                            className="flex-[9]"
                            placeholder={"Select Question"}
                            options={SelectedList}
                            hideSelectedOptions={true}
                            components={{
                              Option: component,
                            }}
                            value={subQuestion.text}
                            onChange={value => handleQuestionChange(value, { mainIterator, subIterator })}
                          />
                        }
                        <p className="flex-[1] p-[2px] flex items-center justify-center rounded border-primary border-[1px] text-primary">
                          {subQuestion.text.marks}</p>
                        {/* Generate New Sub2X Question ⚙ */}
                        <p id={mainIterator + " " + subIterator} className="flex-[1] p-[2px] flex items-center justify-center font-semibold text-xl rounded border-primary border-[1px] hover:bg-primary hover:text-white text-primary"
                          onClick={_ => {
                            let tempQDetails = [...QDetails]
                            let ids = _.currentTarget.id.split(" ")
                            let mainId = parseInt(ids[0])
                            let subId = parseInt(ids[1])
                            let subsub = tempQDetails[mainId].subq[subId].subq
                            tempQDetails[mainId].subq[subId].subq = subsub = [...subsub, { text: { label: '', value: undefined, marks: 0 } }]
                            tempQDetails[mainId].subq[subId] = { text: tempQDetails[mainId].subq[subId].text, subq: subsub }
                            tempQDetails[mainId].subq[subId].text.marks = tempQDetails[mainId].subq[subId].subq.reduce(
                              (accumlator, sub2x) => sub2x.text.marks + accumlator, 0)
                            tempQDetails[mainId].text.marks = tempQDetails[mainId].subq.reduce(
                              (accumlator, sub) => sub.text.marks + accumlator, 0)

                            if (tempQDetails[mainId].subq[subId].subq.length === 1) {
                              tempQDetails[mainId].subq[subId].text.label = ""
                              calculateMarks(tempQDetails)
                            }
                            setQDetails(tempQDetails)
                          }}>
                          +</p>
                          <p className="basis-full"></p>
                          <img className="max-h-[150px] "src={subQuestion.question_image} alt=""/>
                      </div>
                      {/* SUB2X QUESTION 🔴 */}
                      {subQuestion.subq.map((sub2xQuestion, sub2xIterator) => {
                        return <div key={"sub" + sub2xIterator} className="flex flex-col w-full ">

                          <div className="flex-wrap text-[16px] ml-10 h-full m-1 text-start flex gap-2 p-4 pt-0 items-stretch justify-center">
                            <div className="relative flex-[1] flex font-semibold text-xs rounded border-secondary border-[1px] group">
                              <p className={`flex w-full h-full items-center justify-center 
                          text-primary  group-hover:hidden }`}>
                                {sub2xIterator + 1} </p>
                              <p id={mainIterator + " " + subIterator + " " + sub2xIterator} className={`overflow-hidden flex-[1] flex w-0 h-0 rounded items-center justify-center  
                        text-primary  group-hover:h-full group-hover:w-full group-hover:bg-red-500 
                        group-hover:text-white group-hover:transition-all ease-linear `}
                                onClick={() => handleRemove({ mainIterator, subIterator, sub2xIterator }, sub2xQuestion.text.marks)}>Delete</p>
                            </div>
                            <Select
                              className="flex-[9]"
                              placeholder={"Select Question"}
                              options={SelectedList}
                              hideSelectedOptions={true}
                              components={{
                                Option: component,
                              }}
                              value={sub2xQuestion.text}
                              onChange={value => handleQuestionChange(value, { mainIterator, subIterator, sub2xIterator })}
                            />
                            <p className="flex-[1] p-[2px] flex items-center justify-center rounded border-primary border-[1px] text-primary">
                              {sub2xQuestion.text.marks}</p>
                            <p className="basis-full"></p>
                            <img className="max-h-[150px] "src={sub2xQuestion.question_image} alt=""/>
                          </div>
                        </div>
                      })}

                    </div>
                  })}
                </div>
              })}

              <AiFillPlusCircle className="text-primary self-center m-2" onClick={_ => {
                setQDetails([...QDetails, { text: { label: "", marks: 0, value: 0 }, subq: [] }])
              }} />
            </div>

          </div>

        )}
      </div>

      {Page === "PDF" && (
        <div className="fixed w-[90vw] h-[90vh] flex items-center justify-center top-10 left-10">
          {file != null && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
              <div className="w-[100vw] h-[90vh]">
                <Viewer
                  fileUrl={file}
                  plugins={[pageNavigationPluginInstance]}
                />
              </div>
            </Worker>
          )}
          <button
            className="fixed bottom-5 right-7 Button w-[150px]"
            onClick={() => {
              window.api.saveFile(file);
            }}
          >
            {" "}
            Save{" "}
          </button>
        </div>
      )}
    </div>
  );
}
