import httpStatus from "http-status";
import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.util";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given use default password
    userData.password = password ?? config.defaultPassword as string;


    // find academic semester
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

    // start session
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        if (admissionSemester) {
            userData.id = await generateStudentId(admissionSemester, payload.admissionSemester);
        } else {
            throw new AppError(httpStatus.NOT_FOUND, "The given academic semester does not exist");
        }

        // set a student role
        userData.role = 'student';

        // create a user --> transaction 1
        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "failed to create user");
        }

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; // reference Id

        // create a student --> transaction 2
        const newStudent = await Student.create([payload], {session});

        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "failed to create student");
        }
        
        await session.commitTransaction();
        await session.endSession();
        
        return newStudent;

    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
}

export const UserServices = {
    createStudentIntoDB
}