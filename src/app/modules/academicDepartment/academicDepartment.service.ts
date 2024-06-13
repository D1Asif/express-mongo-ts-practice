import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";


const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);

    return result;
}

const getAllAcademicDepartmentsFromDB = async () => {
    const result = await AcademicDepartment.find().populate('academicFaculty');

    return result;
}

const getSingleAcademicDepartmentByIdFromDB = async (departmentId: string) => {
    const result = await AcademicDepartment.findById(departmentId).populate('academicFaculty');

    return result;
}

const updateAcademicDepartmentIntoDB = async (departmentId: string, payload: Partial<TAcademicDepartment>) => {
    const result = await AcademicDepartment.findOneAndUpdate(
        { _id: departmentId },
        payload,
        { new: true }
    );

    return result;
}

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentByIdFromDB,
    updateAcademicDepartmentIntoDB
}