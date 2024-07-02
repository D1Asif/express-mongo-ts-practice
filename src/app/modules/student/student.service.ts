import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    // const queryObject = { ...query };
    // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    // excludeFields.forEach((field) => delete queryObject[field]);
    // console.log({query, queryObject});

    // search by term
    // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
    // let searchTerm = '';

    // if (query?.searchTerm) {
    //     searchTerm = query.searchTerm as string;
    // }

    // const searchQuery = Student.find({
    //     $or: studentSearchableFields.map((field) => (
    //         {
    //             [field]: {
    //                 $regex: searchTerm,
    //                 $options: 'i'
    //             }
    //         }
    //     ))
    // });

    // filtering
    // const filterQuery = searchQuery
    //     .find(queryObject)
    //     .populate('admissionSemester')
    //     .populate({
    //         path: 'academicDepartment',
    //         populate: 'academicFaculty'
    //     });

    // sort
    // let sort = '-createdAt';

    // if (query.sort) {
    //     sort = query.sort as string;
    // }

    // const sortQuery = filterQuery.sort(sort);

    // page & limit
    // let page = 1;
    // let limit = 1;

    // if (query.page) {
    //     page = Number(query.page);
    // }

    // if (query.limit) {
    //     limit = Number(query.limit);
    // }

    // const paginateQuery = sortQuery.skip((page - 1) * limit);

    // const limitQuery = paginateQuery.limit(limit);

    // fields
    // let fields = '-__v'

    // if (query.fields) {
    //     fields = (query.fields as string).split(",").join(" ");
    //     console.log({fields});
    // }

    // const fieldQuery = await limitQuery.select(fields);

    // return fieldQuery;

    const studentQuery = new QueryBuilder(Student.find()
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: 'academicFaculty'
        }), query)
        .search(studentSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const result = await studentQuery.modelQuery;

    return result;
}

const getSingleStudentFromDB = async (id: string) => {

    const result = Student.findById(id).populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: 'academicFaculty'
        });

    return result;
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    let modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData
    }

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`name.${key}`] = value
        }
    }

    const result = await Student.findByIdAndUpdate(
        id,
        modifiedUpdatedData,
        { new: true, runValidators: true }
    )

    return result;
}

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedStudent = await Student.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
        }

        const userId = deletedStudent.user;

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true, session }
        )

        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user.');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error("Failed to deleted student");
    }

}

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB
}