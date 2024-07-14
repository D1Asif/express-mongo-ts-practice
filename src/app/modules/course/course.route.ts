import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create-course", auth('admin'), validateRequest(CourseValidations.createCourseValidationSchema), CourseControllers.createCourse);

router.get("/", auth('admin', 'faculty', 'student'), CourseControllers.getAllCourses);

router.get("/:id",auth('admin', 'faculty', 'student'), CourseControllers.getSingleCourse);

router.patch("/:id", auth('admin'), validateRequest(CourseValidations.updateCourseValidationSchema), CourseControllers.updateCourse);

router.delete("/:id", auth('admin'), CourseControllers.deleteCourse);

router.put("/:courseId/assign-faculties", auth('admin'), validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourseControllers.assignFacultiesWithCourse)

router.delete("/:courseId/remove-faculties", auth('admin'), validateRequest(CourseValidations.facultiesWithCourseValidationSchema), CourseControllers.removeFacultiesFromCourse)

export const CourseRoutes = router;