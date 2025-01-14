import express from "express";
import {
  getAllMessages,
  sendMessage
} from "../controller/messageController.js";
 import{isAdminAuthenticated}from "../middlewares/auth.js"

const router = express.Router();
router.get("/getall", isAdminAuthenticated, getAllMessages )

router.post("/send", sendMessage);
export default router;