import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import studentValidationSchema from "./student.zod.validation";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;

        // creating schema validation using zod
        

        // Data validation using Joi
        // const { error, value } = studentValidationSchema.validate(studentData);

        // data validation using zod
        const {success, data, error} = studentValidationSchema.safeParse(studentData);

        console.log({success, data, error});

        if (!success) {
            res.status(500).json({
                success: false,
                message: 'Error occurred',
                error
            });
        }

        if (data) {
            const result = await StudentServices.createStudentIntoDB(data);

            res.status(200).json({
                success: true,
                message: 'Student is created successfully',
                data: result
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message ?? 'Error occurred',
            error: err
        });
    }
}

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();

        res.status(200).json({
            success: true,
            message: "Students are retrieved successfully",
            data: result
        })
    } catch (err) {
        console.log(err);
    }
}

const getSingleStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const result = await StudentServices.getSingleStudentFromDB(studentId);

        res.status(200).json({
            success: true,
            message: "Student is retrieved successfully",
            data: result
        })
    } catch (err) {
        console.log(err);
    }
}

export const StudentControllers = {
    createStudent,
    getAllStudents,
    getSingleStudent
}