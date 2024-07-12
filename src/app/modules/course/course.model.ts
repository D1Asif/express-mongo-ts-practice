import { Schema, model } from "mongoose";
import { TCourse, TCourseFaculty, TPrerequisiteCourses } from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPrerequisiteCourses>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const courseSchema = new Schema<TCourse>({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    prefix: {
        type: String,
        trim: true,
        required: true
    },
    code: {
        type: Number,
        trim: true,
        required: true
    },
    credits: {
        type: Number,
        trim: true,
        required: true
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
        unique: true
    },
    faculties: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Faculty'
        }]
    }
})

export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema);