import { Types } from "mongoose";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";
import mongoose from "mongoose";
import { Admin } from "../admin/admin.model";
import { Faculty } from "../faculty/faculty.model";

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

export const generateAdminId = async () => {
    let id = 'A-0001';
    const latestAdmin = await Admin.find().sort({createdAt: -1});

    id = latestAdmin.length > 0 
            ? `A-${(Number(latestAdmin[0].id.split("-")[1]) + 1).toString().padStart(4, '0')}` 
            : id;

    return id;
}

export const generateFacultyId = async () => {
    let id = 'F-0001';
    const latestFaculty = await Faculty.find().sort({createdAt: -1});

    id = latestFaculty.length > 0 
            ? `F-${(Number(latestFaculty[0].id.split("-")[1]) + 1).toString().padStart(4, '0')}` 
            : id;

    return id;
}