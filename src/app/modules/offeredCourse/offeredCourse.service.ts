import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface"
import { OfferedCourse } from "./offeredCourse.model"
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.util";
import QueryBuilder from "../../builder/QueryBuilder";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime } = payload;

    //check if the semester registration exists
    const isSemesterRegistrationExist = await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found");
    }

    // get the academic semester
    const academicSemester = isSemesterRegistrationExist.academicSemester;

    //check if the academic faculty exists
    const isAcademicFacultyExist = await AcademicFaculty.findById(academicFaculty);

    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic faculty not found");
    }

    //check if the academic department exists
    const isAcademicDepartmentExist = await AcademicDepartment.findById(academicDepartment);

    if (!isAcademicDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic department not found");
    }

    //check if the course exists
    const isCourseExist = await Course.findById(course);

    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    //check if the faculty exists
    const isFacultyExist = await Faculty.findById(faculty);

    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
    }

    // check if the department belong to the faculty
    const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        academicFaculty,
        _id: academicDepartment
    })

    if (!isDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `The ${isAcademicDepartmentExist.name} does not belong to the ${isAcademicFacultyExist.name}`)
    }

    // check if same offered course same section in same registered semester exists
    const isSameOfferedCourseExistWithSameRegisteredSemesterWithSameSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    })

    if (isSameOfferedCourseExistWithSameRegisteredSemesterWithSameSection) {
        throw new AppError(httpStatus.BAD_REQUEST, "Offered course with same section already exists")
    }

    // get the schedule of the faculty
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select("days startTime endTime")

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, "This faculty is not available at the time. Please choose other time or day")
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester });

    return result;
}

const updateOfferedCourseIntoDB = async (id: string, payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>) => {
    const { faculty, days, startTime, endTime } = payload;

    // check if the offered course exists
    const isOfferedCourseExist = await OfferedCourse.findById(id);

    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!")
    }

    // check status of semester registration
    const { semesterRegistration } = isOfferedCourseExist;
    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);

    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot update this offered course as it is ${semesterRegistrationStatus?.status}`)
    } 

    // check if the faculty exists
    const isFacultyExist = await Faculty.findById(faculty);

    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!")
    }

    
    // get schedule of faculty
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select("days startTime endTime")

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, "This faculty is not available at the time. Please choose other time or day")
    }

    const result = await OfferedCourse.findByIdAndUpdate(
        id,
        payload,
        { new: true}
    );

    return result;
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await offeredCourseQuery.modelQuery;

    return result;
}

const getSingleOfferedCourseFromDB = async(id: string) => {
    const result = await OfferedCourse.findById(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found")
    }

    return result;
}

const deleteOfferedCourseFromDB = async(id: string) => {
    // check offered course exists
    const isOfferedCourseExist = await OfferedCourse.findById(id);

    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found")
    }

    // check semester registration is upcoming
    const semesterRegistration = await SemesterRegistration.findById(isOfferedCourseExist.semesterRegistration);

    const semesterRegistrationStatus = semesterRegistration?.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(httpStatus.BAD_REQUEST, `Offered course cannot be deleted because semester is ${semesterRegistrationStatus}`);
    }

    // delete the offered course
    const result = await OfferedCourse.findByIdAndDelete(id);

    return result;
}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    deleteOfferedCourseFromDB
}