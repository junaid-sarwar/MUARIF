import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

const CourseContext = createContext();

export const CourseContextProvider = ({children})=>{
    const [courses,setCourses] = useState([]);
    const [course,setCourse] = useState([]);

    async function fetchCourses() {
        try {
            const {data} = await axios.get(`${server}/api/course/all`);

            setCourses(data.courses);
        } catch (error) {
            console.log(error);
            
        }
    }

    async function fetchCourse(id) {
        try {
            const {data} = await axios.get(`${server}/api/course/${id}`);
            setCourse(data.course);

        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        fetchCourses();
    },[])
    return (
        <CourseContext.Provider value={{courses, fetchCourses, fetchCourse, course}}>
        {children}
        </CourseContext.Provider>
    );
};

export const CourseData = () => useContext(CourseContext);