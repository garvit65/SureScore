import { Router } from "express";
import { 
    createClassroom, 
    joinClassroom, 
    getUserClassrooms, 
    leaveClassroom, 
    removeStudent, 
    deleteClassroom 
} from "../controllers/classroom.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// Classroom Routes
router.route("/").get(isAuthenticated, getUserClassrooms);   
router.route("/create").post(isAuthenticated, createClassroom); 
router.route("/join").post(isAuthenticated, joinClassroom);  
router.route("/leave").post(isAuthenticated, leaveClassroom);  
router.route("/remove-student").post(isAuthenticated, removeStudent);  
router.route("/:classCode").delete(isAuthenticated, deleteClassroom);

export default router;
