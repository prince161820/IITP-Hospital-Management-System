import express from "express"
import {patientRegister } from "../controller/userController.js";
import { login } from "../controller/userController.js";
import { addNewAdmin } from "../controller/userController.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js";
import { getAllDoctors } from "../controller/userController.js";
import { getUserDetails } from "../controller/userController.js";
import { logoutAdmin } from "../controller/userController.js";
import { logoutPatient} from "../controller/userController.js";
import { addNewDoctor } from "../controller/userController.js";
const router= express.Router();
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/doctors", getAllDoctors);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
export default router;
