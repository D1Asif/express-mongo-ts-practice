import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { AnyZodObject } from "zod";
import { studentValidations } from "../student/student.zod.validation";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";
import { FacultyValidations } from "../faculty/faculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.post(
    '/create-student', 
    auth(USER_ROLE.admin), 
    validateRequest(studentValidations.createStudentValidationSchema),
    UserControllers.createStudent
);

router.post(
    '/create-faculty',
    // auth(USER_ROLE.admin),
    validateRequest(FacultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty
);

router.post(
    '/create-admin', 
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin
);

export const UserRoutes = router;