import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

const findLatestStudent = async () => {
    const lastStudent = await User.findOne(
        {role: 'student'},
        {id: 1, _id: 0}
    )
    .sort({
        createdAt: -1
    })
    .lean();

    return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
}

// year semesterCode 4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
    const currentId = await findLatestStudent() ?? (0).toString();

    console.log();
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;
}