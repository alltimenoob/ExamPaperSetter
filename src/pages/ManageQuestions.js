import { useEffect, useState, useRef } from "react";
import TitleBar from "../components/TitleBar";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { QuestionsList, QuestionFilter } from "../components/Question";
import "react-toastify/dist/ReactToastify.css";
import { GoSettings } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, Slide, toast } from "react-toastify";

export default function ManageQuestions() {
  const location = useLocation();
  const navigate = useNavigate();


  console.log(location.state);

  const CourseID = location.state.course_id;

  const [FullQuestionsList, setFullQuestionsList] = useState([{}]);

  const [SearchQuery, setSeachQuery] = useState("");

  const [FilteredList, setFilteredList] = useState([{}]);

  const [ShowFilter, setShowFilter] = useState(false);


  const Loading = useRef(false);

  useEffect(() => {
    const questions = window.api.getQuestions({ course_id: CourseID });
    questions
      .then((result) => {
        result = result.map((value) => {
          value.value = value.question_id;
          value.label = value.question_text;
          delete value.question_id;
          delete value.question_text;

          return value;
        });
        console.log(result)

        setFullQuestionsList(result);
        setFilteredList(result);
      })
  }, [CourseID, Loading]);

  useEffect(() => {
    if (location.state.message === null) return
    toast(location.state.message)
    Loading.current = !Loading.current
    location.state.message = null
  })

  const [SelectedFilter, setSelectedFilter] = useState({
    course_outcomes: [],
    types: [],
    taxonomies: [],
    units: [],
  });

  const calculateFilter = (filterList) => {
    setSelectedFilter(filterList);

    var temp = FullQuestionsList;

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

    setFilteredList(temp);
  };

  const QuestionsListCallback = (index, type) => {
    if (type === "delete") {
      var temp = FilteredList;
      temp = temp.filter((value) => {
        return value.value !== index;
      });
      setFilteredList(temp);

      return;
    }
  };

  return (
    <div className="App">
      <TitleBar
        name="Manage Questions"
        close={true}
        max={true}
        min={true}
        window="mainWindow"
      />

      <IoArrowBackCircleOutline
        className="fixed top-8 left-0 right-0 bottom-0 w-9 h-9 text-white ml-1 mr-1"
        onClick={() => {
          navigate("/CourseHome", { state: CourseID });
        }}
      />

      <GoSettings
        className="absolute z-20 left-0 top-24 p-[3px] w-9 h-9 text-white overflow-auto animate-pulse"
        onClick={() => {
          setShowFilter(!ShowFilter);
        }}
      />

      <QuestionFilter
        CourseID={CourseID}
        ShowFilter={ShowFilter}
        SelectedFilter={SelectedFilter}
        Callback={calculateFilter}
      />

      <div
        className="fixed top-8 left-10 right-0 bottom-0 w-full h-full bg-white "
        onClick={() => {
          setShowFilter(false);
        }}
      >
        <div className="fixed top-8 right-0 left-11 ">
          <div className="m-5 flex">
            <input
              type="text"
              className="TextBox w-full z-20"
              onChange={(event) => {
                setSeachQuery(event.currentTarget.value);
                var temp = FullQuestionsList;
                temp = temp.filter((value) => {
                  const label = value.label.toUpperCase();
                  return label.includes(
                    event.currentTarget.value.toUpperCase()
                  );
                });
                setFilteredList(temp);
              }}
              placeholder="Search"
              value={SearchQuery}
            />
          </div>

          <div className="fixed top-16 bottom-0 left-3 right-0 p-5">
            {Loading && (
              <QuestionsList
                list={FilteredList}
                callback={QuestionsListCallback}
              />
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        bodyClassName="toastBody"
        transition={Slide}
        position="bottom-center"
        autoClose={300}
        hideProgressBar={true}
        closeOnClick
        rtl={false}
      />
    </div>
  );
}
