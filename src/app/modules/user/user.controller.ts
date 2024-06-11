import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { TStudent } from "../student/student.interface";
import httpStatus from "http-status";

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, student: studentData } = req.body;

        // data validation using zod
        // const {success, data, error} = studentValidationSchema.safeParse(studentData);

        // if (!success) {
        //     res.status(500).json({
        //         success: false,
        //         message: 'Error occurred',
        //         error
        //     });
        // }

        if (studentData) {
            const result = await UserServices.createStudentIntoDB(password, studentData);

            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Student is created successfully",
                data: result
            })
        }

    } catch (err) {
        next(err);
    }
}

export const UserControllers = {
    createStudent
}