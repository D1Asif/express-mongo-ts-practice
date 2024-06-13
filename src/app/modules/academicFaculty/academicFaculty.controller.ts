import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty is created successfully",
        data: result
    })
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculties are fetched successfully",
        data: result
    });
})

const getAcademicFacultyById = catchAsync(async (req, res) => {
    const { facultyId } = req.params;

    const result = await AcademicFacultyServices.getSingleAcademicFacultyByIdFromDB(facultyId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty is fetched successfully",
        data: result
    });
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const body = req.body;

    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(facultyId, body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty is updated successfully",
        data: result
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getAcademicFacultyById,
    updateAcademicFaculty
}