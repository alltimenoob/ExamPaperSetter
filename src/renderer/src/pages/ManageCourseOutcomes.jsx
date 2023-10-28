import TitleBar from "../components/TitleBar";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../components/ContextMenu";
import { ToastContainer, Slide, toast } from "react-toastify";
import { CourseOutcomeList } from "../components/CourseOutcome";

export default function ManageCourseOutcomes() {

    const location = useLocation()
    const navigate = useNavigate()
    const CourseID = location.state

    const [List, setList] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            const result = await window.api.getCourseOutcomes(CourseID)
            setList(result.data)
            console.log(result.data)
            initRender.current = false;
        }

        fetch()
    }, [CourseID])

    const initRender = useRef(false)

    const [doUpdate, setdoUpdate] = useState();

    useEffect(() => {

        if (!initRender.current) {
            initRender.current = true
            setdoUpdate(false)
        }
        else {
            setdoUpdate(true);
        }
    }, [List])

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [SelectedCourseOutcome, setSelectedCourseOutcome] = useState()

    const TextBoxContextMenuItems = [
        <li className="flex justify-center text-primary items-center cursor-pointer hover:bg-primary/10 "
            key={0}
            onClick={() => {
                var list = List;
                list = list.filter((value) => {
                    if (value.added === undefined && value.course_outcomes_id === SelectedCourseOutcome)
                        toast("🔴 Can't Remove This Course Outcome");
                    return (value.course_outcomes_id !== SelectedCourseOutcome || value.added === undefined)
                })
                setList(list)
                setX(0)
                setY(0)
            }}>

            <span className="p-1 text-sm">Remove</span>
        </li>
    ]

    const contextCallback = (data) => {
        setX(data.x)
        setY(data.y)
        setSelectedCourseOutcome(data.id)
    }

    const listCallback = () => {
        setList([...List, { course_outcomes_id: List.length, course_outcomes_description: "", added: true }]);
    }

    const courseOutcomeChangeCallback = (event) => {
        var temp = List;
        temp = temp.map((value) => {
            if (parseInt(event.currentTarget.id) === value.course_outcomes_id) {
                value.course_outcomes_description = event.currentTarget.value;
            }
            return value
        })
        setList(temp)
    }

    return (
        <div className="App">
            <ContextMenu items={TextBoxContextMenuItems} x={x} y={y} ></ContextMenu>

            <TitleBar
                name="Manage Course Outcomes"
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

            <div className="fixed top-8 left-10 right-0 bottom-0 p-5  bg-white ">
                <h1>Course Outcomes</h1>
                <CourseOutcomeList list={List} onContextMenu={contextCallback} onUnitAdd={listCallback}
                    onChange={courseOutcomeChangeCallback} />
                <button className={`Button ${(!doUpdate) ? " pointer-events-none bg-primary/50" : ""}  w-[150px] absolute bottom-5 right-10 self-center`}
                    onClick={() => {
                        if (List.length === 0)
                            return;
                        //do something

                        var isEmpty = false;

                        for (let element of List) {
                            if (element.course_outcomes_description === undefined ||
                                element.course_outcomes_description === "" ||
                                element.course_outcomes_description === null) {
                                isEmpty = true;
                                break;
                            }
                        }


                        if (isEmpty)
                            return;

                        const data = {
                            course_id: CourseID,
                            data: List.map((value, i) => {
                                return {
                                    course_outcomes_id: value.course_outcomes_id,
                                    course_outcomes_description: value.course_outcomes_description,
                                    course_outcomes_number: i + 1,
                                    added: value.added,
                                }
                            })
                        }

                        const request = async (data) => {
                            const result = await window.api.updateCourseOutcomes(data);
                            toast(result.error)
                        }

                        request(data)

                    }} >Update</button>
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
        </div >)

}