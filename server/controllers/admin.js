import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm, unlink } from 'fs';
import {promisify} from 'util';
import fs from 'fs';
import { User } from '../models/User.js'

export const createCourse = TryCatch(async(req,res)=>{
    const {title,description,category,createdBy,duration,price} = req.body;
    
    const image = req.file;

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path,
        duration,
        price,
    });

    res.status(201).json({
        message: "Course Created Sucessfully"
    })
})

export const addLecture = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);

    if(!course) 
        return res.status(404).json({
        message:"No Course with this id"
    });
    
    const {title,description} = req.body;

    const file = req.file

    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,
    });
    
    res.status(201).json({
        message:"Lecture Added Successfully",
        lecture,
    })
});

export const deleteLecture = TryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);

    rm(lecture.video,()=>{
        console.log("Video Deleted");
    });

    await lecture.deleteOne();
    
    res.json({message: "Lecture Deleted Sucessfully"});
});

const unlinkAsync = promisify(fs.unlink)

export const deleteCourse = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);

    const lectures = await Lecture.find({course: course._id});

    await Promise.all(
        lectures.map(async(lecture)=>{
            await unlinkAsync(lecture.video);
            console.log("Video Deleted")
        })
    );

    rm(course.image,()=>{
        console.log("Image Deleted");
    });

    await Lecture.find({course: req.params.id}).deleteMany();

    await course.deleteOne();

    await User.updateMany({},{$pull:{subscription: req.params.id}});

    res.json({
        message: "Course Deleted Successfully",
    });
});

export const getAllStats = TryCatch(async(req,res)=>{
    const totalCourses = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUser = (await User.find()).length;

    const stats = {
        totalCourses,
        totalLectures,
        totalUser
    };

    res.json({
        stats,
    })
});