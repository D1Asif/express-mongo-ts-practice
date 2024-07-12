import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { AcademicSemester } from "../academicSemester/academicSemester.model"
import { TSemesterRegistration } from "./semesterRegistration.interface"
import { SemesterRegistration } from "./semesterRegistration.model"
import QueryBuilder from "../../builder/QueryBuilder"
import { RegistrationStatus } from "./semesterRegistration.constant"
import mongoose from "mongoose"
import { OfferedCourse } from "../offeredCourse/offeredCourse.model"

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload?.academicSemester

    // check if there is any semester that is already 'UPCOMING' or 'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [
            { status: RegistrationStatus.ONGOING },
            { status: RegistrationStatus.UPCOMING }
        ]
    });

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`)
    }

    // check if semester exists
    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester)
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, "The academic semester found")
    }

    // check if the semester already exists
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({
        academicSemester
    })

    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.CONFLICT, "")
    }

    const result = await SemesterRegistration.create(payload);

    return result;
}

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await semesterRegistrationQuery.modelQuery;

    return result;
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);

    return result;
}

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    // check if the requested semester exists
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "The semester is not found!")
    }

    // if the requested semester registration is ended, we will not update anything.
    const currentSemesterStatus = isSemesterRegistrationExists.status;
    const requestedStatus = payload?.status;

    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`)
    }

    // UPCOMING --> ONGOING --> ENDED
    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot change status from ${currentSemesterStatus} to ${requestedStatus}`)
    }

    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot change status from ${currentSemesterStatus} to ${requestedStatus}`)
    }

    const result = await SemesterRegistration.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true
        }
    )

    return result;
}

const deleteSemesterRegistrationFromDB = async (id: string) => {
    // check if semester registration exists
    const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
    }

    // check if semester registration status is UPCOMING
    const semesterRegistrationStatus = isSemesterRegistrationExist.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(httpStatus.BAD_REQUEST, `The semester registration cannot be deleted because it is ${semesterRegistrationStatus}`);
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedOfferedCourses = await OfferedCourse.deleteMany(
            { semesterRegistration: id },
            { session }
        );

        if (!deletedOfferedCourses) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete semester registration");
        };

        const deletedSemesterRegistration = await SemesterRegistration.findByIdAndDelete(id,
            { session, new: true }
        );

        if (!deletedSemesterRegistration) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete semester registration");
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedSemesterRegistration;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
}