import TitleBar from "../components/TitleBar";
import { BiBookContent } from "react-icons/bi";
import { useEffect, useState } from "react";
import ContextMenu from "../components/ContextMenu";
import { useNavigate } from "react-router-dom";

export default function OpenCourse() {
  const navigate = useNavigate();

  const [ResultList, setResultList] = useState([]);
  const [SearchList, setSearchList] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [SelectedTextBox, setSelectedTextBox] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const result = await window.api.getCourses();

      if (result.statusCode) {
        setResultList(result.courses);
        setSearchList(result.courses);
      }
    };

    fetch();

    window.api.reload(() => {
      fetch();
    });
    
  }, [navigate]);

  const openNewCourse = async () => {
    await window.api.openNewCourse();
  };

  const updateCourse = async (args) => {
    await window.api.updateCourseWindow(args);
  };

  const removeCourse = async (args) => {
    await window.api.removeCourse(args);
  };

  const TextBoxContextMenuItems = [
    <li
      className="flex justify-start text-primary items-center cursor-pointer hover:bg-primary/10 "
      key={0}
      onClick={() => {
        let temp = ResultList;
        temp = temp.filter((value) => {
          return value.id.toString() === SelectedTextBox;
        });

        if (temp[0] !== undefined) updateCourse(temp[0]);
      }}
    >
      <span className="ml-5 p-1 text-sm">Edit Course</span>
    </li>,
    <li
      className="flex justify-start text-primary items-center cursor-pointer hover:bg-primary/10 "
      key={1}
      onClick={() => {
        let temp = SearchList;
        temp = temp.filter((value) => {
          return value.id.toString() !== SelectedTextBox;
        });
        setSearchList(temp);
        removeCourse(SelectedTextBox);
      }}
    >
      <span className="ml-5 p-1 text-sm">Remove</span>
    </li>,
  ];

  return (
    <div
      className="App"
      onClick={() => {
        setX(0);
        setY(0);
      }}
    >
      <ContextMenu items={TextBoxContextMenuItems} x={x} y={y}></ContextMenu>

      {/* TitleBar Containing Name , Minimize, Maximize, Close*/}
      <TitleBar
        name="Exam Paper"
        max={true}
        min={true}
        close={true}
        window="mainWindow"
      ></TitleBar>

      <div className="mt-8 w-screen h-screen bg-white">
        <div className="grid grid-flow-col grid-cols-4 justify-items-start items-center gap-1 m-2 w-full">
          <input
            type="text"
            placeholder="Search"
            value={SearchQuery}
            onChange={(event) => {
              setSearchQuery(event.currentTarget.value);

              let temp = ResultList;

              if (event.currentTarget.value !== "") {
                temp = temp.filter((value) => {
                  return value.name.includes(event.currentTarget.value);
                });
              }

              setSearchList(temp);
            }}
            className="TextBox w-full col-span-4 "
          />
          <button className="Button w-[140px] mr-4" onClick={openNewCourse}>
            New Course
          </button>
        </div>
        <hr className="ml-2 mr-2"></hr>

        <div className="grid justify-items-start items-center gap-1 w-full p-2 text-primaryDark">
          <div className="overflow-y-scroll w-full max-h-screen">
            {SearchList.length === 0 ? (
              <span className="select-none text-[18px]">No Courses Found</span>
            ) : (
              ""
            )}

            {SearchList.map((value) => {
              return (
                <div
                  key={value.id}
                  id={value.id}
                  className=" border-2 w-full items-center p-2 flex h-[60px]
                           shadow rounded  hover:cursor-pointer"
                  onContextMenu={(event) => {
                    setSelectedTextBox(event.currentTarget.id);
                    if (event.pageX + 120 > window.innerWidth) {
                      setX(event.pageX - 120);
                    } else {
                      setX(event.pageX);
                    }

                    setY(event.pageY);
                  }}
                  onClick={(event) => {
                    navigate("/Course", { state: event.currentTarget.id });
                  }}
                >
                  <BiBookContent className="h-[60px] w-[25px]" />
                  <div className="flex ml-2 flex-col justify-center  p-2 items-start">
                    <span className="text-start text-[18px]">{value.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
