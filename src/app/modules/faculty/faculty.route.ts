import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";

const router = express.Router();

router.get("/", )
router.get("/", )
router.patch("/", validateRequest(FacultyValidations.updateFacultyValidationSchema), )

export const FacultyRoutes = router;