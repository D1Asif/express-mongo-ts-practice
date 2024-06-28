import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", )
router.get("/", )
router.patch("/", validateRequest(AdminValidations.updateAdminValidationSchema), )

export const AdminRoutes = router;