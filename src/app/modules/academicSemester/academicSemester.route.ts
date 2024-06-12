import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import { AcademicSemesterControllers } from "./academicSemester.controller";

const router = express.Router();

router.post('/create-academic-semester', validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester);

router.get('/', AcademicSemesterControllers.getAllAcademicSemester);

router.get('/:semesterId', AcademicSemesterControllers.getAcademicSemesterById);

router.patch('/:semesterId', validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidationSchema), AcademicSemesterControllers.updateAcademicSemester);

export const AcademicSemesterRoutes = router;