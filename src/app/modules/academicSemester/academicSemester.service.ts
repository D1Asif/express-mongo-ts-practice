import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    // semester name --> semester code
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code");
    }

    const result = await AcademicSemester.create(payload);

    return result;
}

const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemester.find();

    return result;
}

const getAcademicSemesterByIdFromDB = async (semesterId: string) => {
    const result = await AcademicSemester.findById(semesterId);

    return result;
}

const updateAcademicSemesterIntoDB = async (semesterId: string, payload: Partial<TAcademicSemester>) => {
    if (payload?.name && payload?.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code")
    }
    
    const result = await AcademicSemester.updateOne(
        { _id: semesterId },
        payload,
        { new: true }
    );

    return result;
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getAcademicSemesterByIdFromDB,
    updateAcademicSemesterIntoDB
}