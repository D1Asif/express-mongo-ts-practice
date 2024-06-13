import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.util";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given use default password
    userData.password = password ?? config.defaultPassword as string;
    

    // find academic semester
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

    // set manually generated id
    
    if (admissionSemester) {
        userData.id = await generateStudentId(admissionSemester, payload.admissionSemester);
    } else {
        throw new Error("The given academic semester does not exist");
    }

    // set a student role
    userData.role = 'student';

    // create a user
    const newUser = await User.create(userData);

    // create a student
    if (Object.keys(newUser).length) {
        // set id, _id as user
        payload.id = newUser.id;
        payload.user = newUser._id; // reference Id

        const newStudent = await Student.create(payload);

        return newStudent;
    }
}

export const UserServices = {
    createStudentIntoDB
}