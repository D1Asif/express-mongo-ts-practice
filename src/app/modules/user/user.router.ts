import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { AnyZodObject } from "zod";
import { studentValidations } from "../student/student.zod.validation";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";
import { FacultyValidations } from "../faculty/faculty.validation";

const router = express.Router();

router.post('/create-student', validateRequest(studentValidations.createStudentValidationSchema), UserControllers.createStudent);

router.post('/create-admin', validateRequest(AdminValidations.createAdminValidationSchema), UserControllers.createAdmin);

router.post('/create-faculty', validateRequest(FacultyValidations.createFacultyValidationSchema), UserControllers.createFaculty);

export const UserRoutes = router;