import { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar";

import {
  IoArrowBackCircleOutline,
  IoCreate,
  IoAddCircle,
} from "react-icons/io5";
import { BsFillPatchQuestionFill, BsInboxesFill } from "react-icons/bs";
import { GiWhiteBook } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";

export default function Course() {
  const navigate = useNavigate();

  const location = useLocation();

  const [Course, SetCourse] = useState({});
  const CourseID = location.state;

  useEffect(() => {
    async function getData() {
      const data = await window.api.getCourseFromID(CourseID);
      SetCourse(data);
    }

    getData();
  }, [CourseID]);

  return (
    <div className="App">
      <TitleBar
        name={Course.name}
        close={true}
        max={true}
        min={true}
        window="mainWindow"
      />

      <div className="mt-8  w-screen  h-screen bg-white flex items-start">
        <div className="h-screen w-[200px] bg-primary flex flex-col ">
          <div
            className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
            onClick={() => {
              navigate("/");
            }}
          >
            <IoArrowBackCircleOutline className=" w-9 p-[1px] h-9 ml-1 mr-1" />
            <span>Back</span>
          </div>

          <div
            className="mt-5 pt-2 pb-2 flex text-[12px] items-center justify-start text-white hover:bg-primaryDark"
            onClick={() => {
              navigate("/GeneratePaper", { state: CourseID });
            }}
          >
            <IoCreate className="w-9 h-9  ml-1 mr-1" />
            <span>Generate Paper</span>
          </div>

          <div
            className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
            onClick={() => {
              navigate("/AddQuestion", { state: CourseID });
            }}
          >
            <IoAddCircle className="w-9 h-9 text-white ml-1 mr-1" />
            <span>Add Questions</span>
          </div>

          <div
            className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
            onClick={() => {
              navigate("/ManageQuestions", {
                state: {
                  course_id: CourseID, message: null
                },
              });
            }}
          >
            <BsFillPatchQuestionFill className="w-9 h-9 p-[2px] text-white ml-1 mr-1" />

            <span>Manage Question</span>
          </div>

          <div
            className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
            onClick={() => {
              navigate("/ManageUnits", { state: CourseID })
            }}
          >
            <BsInboxesFill
              className="w-9 h-9 p-[4px] text-white ml-1 mr-1" />

            <span>Manage Units</span>
          </div>

          <div
            className="flex pt-2 pb-2 text-[12px] items-center justify-start text-white hover:bg-primaryDark"
            onClick={() => {
              navigate("/ManageCourseOutcomes", { state: CourseID })
            }}
          >
            <GiWhiteBook className="w-9 h-9 p-[2px] text-white ml-1 mr-1" />

            <span>Manage COs</span>
          </div>
        </div>
        <div className="m-5  flex flex-col gap-2 w-full items-center justify-center ">
          <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">
            Old Papers #1
          </span>
          <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">
            Old Papers #2
          </span>
          <span className="text-lg text-center text-white p-1 rounded bg-primary w-full">
            Old Papers #3
          </span>
        </div>
      </div>
    </div>
  );
}
