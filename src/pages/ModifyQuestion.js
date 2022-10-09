import TitleBar from "../components/TitleBar";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { AiFillPlusCircle } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { default as Select, components } from "react-select";
import "react-toastify/dist/ReactToastify.css";
import ContextMenu from "../components/ContextMenu";

export default function ModifyQuestion() {
  const location = useLocation();
  const navigate = useNavigate();

  const QuestionID = location.state.value;
  const CourseID = location.state.course_id;

  const [SelectedType, setSelectedType] = useState(
    location.state.question_type_id
  );
  const [Options, setOptions] = useState(
    location.state.mcqs.length === 0
      ? [{ label: "", id: 0 }]
      : location.state.mcqs
  );
  const [Question, setQuestion] = useState(location.state.label);
  const [Taxonomy, setTaxonomy] = useState(location.state.taxonomy_id);
  const [Marks, setMarks] = useState(location.state.marks);

  const [CourseOutcomeList, setCourseOutcomeList] = useState([]);
  const [UnitsList, setUnitsList] = useState([]);
  const [TypeList, setTypeList] = useState([]);
  const [TaxonomyList, setTaxonomyList] = useState([]);

  const [SelectedCOList, setSelectedCOList] = useState(
    location.state.cource_outcomes
  );
  const [SelectedUnit, setSelectedUnit] = useState({
    label: location.state.unit_name,
    value: location.state.unit_id,
  });
  const [SelectedImage, setSelectedImage] = useState(location.state.question_image);
  const [ShowImage, setShowImage] = useState(false);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (location.state === (undefined || null)) return;

    const units = window.api.getUnits(CourseID);
    const co = window.api.getCourseOutcomes(CourseID);
    const taxonomy = window.api.getTaxonomy();
    const types = window.api.getQuestionTypes();

    Promise.all([units, co, taxonomy, types])
      .then((values) => {
        setUnitsList(
          values[0].data.map((value) => {
            return {
              label: value.unit_name,
              value: value.unit_id,
            };
          })
        );
        setCourseOutcomeList(
          values[1].data.map((value) => {
            return {
              course_outcomes_number: value.course_outcomes_number,
              label: value.course_outcomes_description,
              value: value.course_outcomes_id,
            };
          })
        );
        setTaxonomyList(values[2].taxonomy);
        setTypeList(values[3].question_types);
      })
      .catch(() => {
        const options = {
          window: "CourseWindow",
          options: {
            type: "error",
            buttons: ["Ok"],
            title: "Error",
            message: "Something went wrong with database!",
            detail:
              "There might be some issues like empty fields, disrupted database connection",
          },
        };

        window.api.showDialog(options);
        window.api.goBack();
      });
  }, [CourseID, location.state]);

  const component = (props) => {
    return (
      <div className="p-0">
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />
          <label className="ml-2">{props.label}</label>
        </components.Option>
      </div>
    );
  };

  var Change = false;

  const checkChange = () => {
    const current = {
      question_type_id: SelectedType,
      marks: Marks ? Marks : 0,
      course_id: CourseID,
      taxonomy_id: Taxonomy,
      unit_id: SelectedUnit.value,
      question_image: null,
      cource_outcomes: SelectedCOList,
      mcqs: Options,
      value: QuestionID,
      label: Question,
    };

    const prev = JSON.parse(JSON.stringify(location.state));

    delete prev.taxonomy_letter;
    delete prev.taxonomy_name;
    delete prev.unit_description;
    delete prev.unit_name;
    delete prev.question_type_name;

    const val = JSON.stringify(current) === JSON.stringify(prev);
    Change = !val;
    return val;
  };

  const [SelectedMCQ, setSelectedMCQ] = useState("");
  const MCQContextMenu = [
    <li
      className="flex justify-center text-primary items-center cursor-pointer hover:bg-primary/10 "
      key={0}
      onClick={() => {
        var temp = Options;
        temp = Options.filter((_, i) => {
          return i !== SelectedMCQ;
        });
        setOptions(temp);
      }}
    >
      <span className="p-1 text-sm">Remove</span>
    </li>,
  ];
  if (location.state === (undefined || null)) return <div>Nothing</div>;

  return (
    <div
      className="App"
      onClick={() => {
        setX(0);
        setY(0);
      }}
    >
      <ContextMenu items={MCQContextMenu} x={x} y={y}></ContextMenu>
      <TitleBar name="Modify Question" min={true} max={true} close={true} />

      <IoArrowBackCircleOutline
        className="fixed top-8 left-0 right-0 bottom-0 w-9 h-9 text-white ml-1 mr-1"
        onClick={() => {
          navigate('/ManageQuestions', { state: { course_id: CourseID, message: null } })
        }}
      />

      <div className="fixed top-8 left-10 right-0 bottom-0 bg-white flex items-start overflow-y-scroll">
        <div className="m-5 mt-10 flex flex-col gap-2 w-screen max-h-full ">
          <div className="flex gap-2">
            <select
              className="TextBox w-full "
              value={SelectedType}
              onChange={(event) => {
                setSelectedType(parseInt(event.currentTarget.value));
              }}
              id="types"
            >
              {TypeList.map((value, index) => {
                return (
                  <option key={index} value={value.question_type_id}>
                    {value.question_type_name}
                  </option>
                );
              })}
            </select>

            <select
              className="TextBox w-full"
              id="types"
              value={Taxonomy}
              onChange={(event) => {
                setTaxonomy(parseInt(event.currentTarget.value));
              }}
            >
              {TaxonomyList.map((value, index) => {
                return (
                  <option key={index} value={value.taxonomy_id}>
                    {value.taxonomy_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-2">
            <span className="w-full max-w-[50%] p-0 text-[16px] text-start border-b-2 border-b-primary">
              <Select
                placeholder={"Select COs"}
                options={CourseOutcomeList}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option: component,
                }}
                onChange={(list) => {
                  setSelectedCOList(list);
                }}
                allowSelectAll={true}
                value={SelectedCOList}
              />
            </span>

            <span className="w-full max-w-[50%] p-0 text-[16px] text-start border-b-2 border-b-primary">
              <Select
                placeholder={"Select Unit"}
                options={UnitsList}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option: component,
                }}
                onChange={(value) => {
                  setSelectedUnit(value);
                }}
                value={SelectedUnit}
              />
            </span>
          </div>

          <textarea
            className="TextBox w-full "
            value={Question}
            onChange={(event) => {
              setQuestion(event.currentTarget.value);
            }}
            placeholder="Enter Question"
          />

          {TypeList.find((value) => {
            return (
              value.question_type_name === "MCQ" &&
              value.question_type_id.toString() === SelectedType.toString()
            );
          }) !== undefined && (
              <div className="grid w-full grid-flow-col grid-cols-6">
                {Options.map((value, index) => {
                  return (
                    <input
                      type="text"
                      key={index}
                      id={index}
                      value={value.label}
                      className="TextBox mb-2 w-full"
                      onChange={(event) => {
                        const temp = [...Options];
                        temp[index] = {
                          label: event.currentTarget.value,
                          id: index,
                        };
                        setOptions(temp);
                      }}
                      onContextMenu={(event) => {
                        setSelectedMCQ(parseInt(event.target.id));

                        if (event.pageX + 120 > window.innerWidth) {
                          setX(event.pageX - 120);
                        } else {
                          setX(event.pageX);
                        }

                        setY(event.pageY);
                      }}
                      placeholder={"Option " + String.fromCharCode(index + 65)}
                    />
                  );
                })}

                <AiFillPlusCircle
                  className="m-auto h-[28px] text-primary cursor-pointer"
                  onClick={() => {
                    if ([...Options].length < 6)
                      setOptions([...Options, { label: "" }]);
                  }}
                />
              </div>
            )}

          <input
            type="number"
            className="TextBox w-full"
            value={Marks}
            onChange={(event) => {
              setMarks(parseInt(event.currentTarget.value));
            }}
            placeholder="Enter Marks"
          />

          <label className="TextBox w-full flex items-center justify-start">
            <input
              type="checkbox"
              checked={ShowImage}
              onChange={(event) => {
                setShowImage(!ShowImage);
                if (ShowImage) {
                  setSelectedImage("");
                }
              }}
            />
            <span className="ml-2">Attach Diagram,Table? </span>
          </label>

          {ShowImage && SelectedImage !== "" && (
            <img src={SelectedImage} height="50px" width="50px" alt="None" />
          )}

          {ShowImage && (
            <label className="Button w-full flex items-center justify-center">
              <input
                type="file"
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
                onChange={(event) => {
                  const path = event.target.files[0];

                  new Promise((resolve, reject) => {
                    let file = new FileReader();
                    file.onload = (event) => {
                      setSelectedImage(event.target.result);
                      resolve(event.target.result);
                    };
                    file.onerror = (err) => {
                      reject(err);
                    };
                    file.readAsDataURL(path);
                  });
                }}
              />

              <span>Select Image</span>
            </label>
          )}

          <div className="flex w-full gap-2 justify-center items-center">
            <button
              className={`Button mt-5 flex-1 ${checkChange() ? " bg-primary/60 hover:shadow-none" : ""
                }`}
              onClick={() => {
                if (!Change) return;

                const args = {
                  question_id: QuestionID,
                  course_id: CourseID,
                  question_text: Question,
                  question_type_id: SelectedType,
                  isMCQ:
                    TypeList.find((value) => {
                      return (
                        value.question_type_id.toString() ===
                        SelectedType.toString() &&
                        value.question_type_name === "MCQ"
                      );
                    }) !== undefined,
                  marks: Marks,
                  options: Options.map((value) => {
                    return value.label;
                  }),
                  taxonomy_id: Taxonomy,
                  unit_id: parseInt(SelectedUnit.value),
                  cource_outcome_ids: SelectedCOList.map((value) => {
                    return value.value;
                  }),
                  question_image: SelectedImage,
                };

                var isEmpty = Object.values(args).includes(undefined || "");
                isEmpty =
                  isEmpty ||
                  args.cource_outcome_ids.length === 0 ||
                  (args.isMCQ
                    ? (Object.values(args.options).includes("") || args.options.length === 0)
                    : false);

                if (isEmpty) {
                  const options = {
                    window: "mainWindow",
                    options: {
                      type: "error",
                      buttons: ["Cancel"],
                      title: "Some Error Occured",
                      message: "There are some missing fields!",
                      detail:
                        "Please fill all the required data like course outcomes, units, mcqs options(if selected)",
                    },
                  };

                  const result = async () => {
                    return await window.api.showDialog(options)
                  }

                  result();
                  return;
                }

                const callback = async () => {
                  const result = await window.api.updateQuestion(args);

                  result
                    ? navigate("/ManageQuestions", {
                      state: {
                        course_id: CourseID,
                        message: result.error.toString(),
                      },
                    })
                    : console.log("wrong");

                };

                callback();
              }}
            >
              Update
            </button>

            <button
              className={`Button mt-5 flex-1 ${Question.replaceAll(" ", "") ===
                location.state.label.replaceAll(" ", "")
                ? " bg-primary/60 hover:shadow-none"
                : ""
                }`}
              onClick={() => {
                if (
                  Question.replaceAll(" ", "") ===
                  location.state.label.replaceAll(" ", "")
                )
                  return;

                const args = {
                  course_id: CourseID,
                  question_text: Question,
                  question_type_id: SelectedType,
                  isMCQ:
                    TypeList.find((value) => {
                      return (
                        value.question_type_id.toString() ===
                        SelectedType.toString() &&
                        value.question_type_name === "MCQ"
                      );
                    }) !== undefined,
                  marks: Marks,
                  options: Options.map((value) => {
                    return value.value;
                  }),
                  taxonomy_id: Taxonomy,
                  unit_id: parseInt(SelectedUnit.value),
                  cource_outcome_ids: SelectedCOList.map((value) => {
                    return value.value;
                  }),
                  question_image: SelectedImage,
                };

                const show = async () => {
                  const result = await window.api.insertQuestion(args)
                  result
                    ? navigate("/ManageQuestions", {
                      state: {
                        course_id: CourseID,
                        message: result.error.toString(),
                      },
                    })
                    : console.log("wrong");
                }

                show()
              }}
            >
              Save As New
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
