import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";
import { FacultyControllers } from "./faculty.controller";

const router = express.Router();

router.get("/", FacultyControllers.getAllFaculty)

router.get("/:id", FacultyControllers.getSingleFaculty)

router.patch("/:id", validateRequest(FacultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty)

router.delete("/:id", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;