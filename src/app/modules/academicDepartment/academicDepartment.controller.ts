import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department is created successfully",
        data: result
    })
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic departments are fetched successfully",
        data: result
    });
})

const getAcademicDepartmentById = catchAsync(async (req, res) => {
    const { departmentId } = req.params;

    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentByIdFromDB(departmentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department is fetched successfully",
        data: result
    });
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const body = req.body;

    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(departmentId, body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department is updated successfully",
        data: result
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getAcademicDepartmentById,
    updateAcademicDepartment
}