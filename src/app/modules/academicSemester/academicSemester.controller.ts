import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {

    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester is created successfully",
        data: result
    })
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semesters are fetched successfully",
        data: result
    });
})

const getAcademicSemesterById = catchAsync(async (req, res) => {
    const { semesterId } = req.params;

    const result = await AcademicSemesterServices.getAcademicSemesterByIdFromDB(semesterId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester is fetched successfully",
        data: result
    });
})

const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const body = req.body;

    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(semesterId, body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester is updated successfully",
        data: result
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getAcademicSemesterById,
    updateAcademicSemester
}