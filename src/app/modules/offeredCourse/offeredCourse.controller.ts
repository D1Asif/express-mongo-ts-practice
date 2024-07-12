import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course successfully created",
        data: result
    })
});

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course successfully updated",
        data: result
    })
})

const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered courses successfully retrieved",
        data: result
    })
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course successfully retrieved",
        data: result
    })
})

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Offered course successfully deleted",
        data: result
    })
})

export const OfferedCourseControllers = {
    createOfferedCourse,
    updateOfferedCourse,
    getAllOfferedCourses,
    getSingleOfferedCourse,
    deleteOfferedCourse
}