import { Types } from "mongoose";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";
import mongoose from "mongoose";

const findLatestStudentInSemester = async (semesterId: Types.ObjectId) => {
    const lastStudent = await User.aggregate([
        {
            $match: {
                role: 'student'
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: '_id',
                foreignField: 'user',
                as: "studentInfo"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$studentInfo", 0] }, "$$ROOT"] } }
        },
        {
            $project: {
                admissionSemester: 1,
                createdAt: 1,
                id: 1,
                email: 1
            }
        },
        {
            $match: {
                admissionSemester: new mongoose.Types.ObjectId(semesterId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return lastStudent[0]?.id ? lastStudent[0].id.substring(6) : undefined;
}

// year semesterCode 4 digit number
export const generateStudentId = async (payload: TAcademicSemester, admissionSemesterId: Types.ObjectId) => {
    const currentId = await findLatestStudentInSemester(admissionSemesterId) ?? (0).toString();

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;
}