import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";
import { FacultyControllers } from "./faculty.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get("/", auth(USER_ROLE.admin, USER_ROLE.faculty), FacultyControllers.getAllFaculty)

router.get("/:id", FacultyControllers.getSingleFaculty)

router.patch("/:id", validateRequest(FacultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty)

router.delete("/:id", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;