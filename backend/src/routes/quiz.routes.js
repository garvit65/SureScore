import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    createQuiz,
    getClassroomQuizzes,
    getTeacherQuizzes,
    getStudentQuizzes,
    submitQuiz,
    getQuizAttempts,
    autoSubmitQuiz,
    trackProctoringEvent
} from "../controllers/quiz.controller.js";

const router = Router();

// Teacher Routes
router.post("/create", isAuthenticated, createQuiz);
router.get("/teacher", isAuthenticated, getTeacherQuizzes); 
router.get("/classroom/:classCode", isAuthenticated, getClassroomQuizzes);
router.get("/:quizId/attempts", isAuthenticated, getQuizAttempts);
// router.get("/results/:quizId", isAuthenticated, getQuizResults);

// Student Routes
router.get("/student", isAuthenticated, getStudentQuizzes);  
router.post("/submit/:quizId", isAuthenticated, submitQuiz); 
router.post("/auto-submit", isAuthenticated, autoSubmitQuiz);

// 🔹 Proctoring Route
router.post("/proctoring-event", isAuthenticated, trackProctoringEvent);


export default router;
