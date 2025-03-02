import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Classroom } from "../models/classroom.model.js";
import { Quiz } from "../models/quiz.model.js";



/**
 * @desc Create a new quiz (Teachers only)
 * @route POST /api/quizzes
 * @access Private (Teacher)
 */
export const createQuiz = asyncHandler(async (req, res) => {
    if (req.user.userType !== "teacher") {
        throw new ApiError(403, "Only teachers can create quizzes");
    }

    const { classCode, title, questions, startTime, endTime } = req.body;

    console.log(classCode, title, questions, startTime, endTime);   

    if (!classCode || !title || !questions || !startTime || !endTime) {
        throw new ApiError(400, "All fields are required");
    }

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only create quizzes for your own classrooms");
    }

    // Convert timestamps to Date objects
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate that startTime is before endTime
    if (start >= end) {
        throw new ApiError(400, "Start time must be before end time");
    }

    // Calculate duration in minutes
    const duration = Math.round((end - start) / (1000 * 60));

    const quiz = await Quiz.create({
        title,
        questions,
        startTime,
        endTime,
        duration,  // Automatically set
        classroom: classroom._id,
        teacher: req.user._id,
    });


    classroom.quizzes.push(quiz._id);
    await classroom.save();

    return res.status(201).json(new ApiResponse(201, quiz, "Quiz created successfully"));
});




/**
 * @desc Get quizzes created by a teacher
 * @route GET /api/quizzes/teacher
 * @access Private (Teacher)
 */
export const getTeacherQuizzes = asyncHandler(async (req, res) => {
    if (req.user.userType !== "teacher") {
        throw new ApiError(403, "Only teachers can view their quizzes");
    }

    const quizzes = await Quiz.find({ teacher: req.user._id });

    return res.status(200).json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});



/**
 * @desc Get quizzes available for a student in their classrooms
 * @route GET /api/quizzes/student
 * @access Private (Student)
 */
export const getStudentQuizzes = asyncHandler(async (req, res) => {
    if (req.user.userType !== "student") {
        throw new ApiError(403, "Only students can view quizzes assigned to them");
    }

    const classrooms = await Classroom.find({ students: req.user._id }).populate("quizzes");
    const quizzes = classrooms.flatMap(classroom => classroom.quizzes);

    return res.status(200).json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});


export const getClassroomQuizzes = asyncHandler(async (req, res) => {
    const { classCode } = req.params;

    const classroom = await Classroom.findOne({ classCode }).populate("quizzes");

    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    return res.status(200).json(new ApiResponse(200, classroom.quizzes, "Classroom quizzes fetched successfully"));
});



/**
 * @desc Submit a quiz attempt (Students only)
 * @route POST /api/quizzes/submit
 * @access Private (Student)
 */
export const submitQuiz = asyncHandler(async (req, res) => {
    if (req.user.userType !== "student") {
        throw new ApiError(403, "Only students can submit quiz attempts");
    }

    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !answers || !Array.isArray(answers) || timeTaken == null) {
        throw new ApiError(400, "Quiz ID, answers, and time taken are required");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    if (!quiz.questions || !Array.isArray(quiz.questions)) {
        throw new ApiError(500, "Quiz questions not found or not an array");
    }

    const existingAttempt = quiz.submissions.find(attempt => attempt.student.toString() === req.user._id.toString());
    if (existingAttempt) {
        throw new ApiError(400, "You have already submitted this quiz");
    }

    let score = 0;
    let confidenceAnalysis = [];

    // ✅ Fix: Use selectedOption directly without indexOf()
    const processedAnswers = answers.map((answer) => {
        const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
        if (!question) return null;

        // Validate that the selected option is within range
        if (answer.selectedOption < 0 || answer.selectedOption >= question.options.length) {
            throw new ApiError(400, `Invalid answer choice for question ${question._id}`);
        }

        const correctness = answer.selectedOption === question.correctOption;
        if (correctness) score++;

        confidenceAnalysis.push({
            question: question._id,
            studentAttempt: answer.selectedOption, // Already an index
            correctAnswer: question.correctOption,
            confidenceLevel: answer.confidenceLevel,
            correctness,
            topic: question.topic
        });

        return {
            question: question._id,
            selectedOption: answer.selectedOption, // Already an index
            confidenceLevel: answer.confidenceLevel
        };
    }).filter(Boolean); // Remove null entries if a question is missing

    if (processedAnswers.length === 0) {
        throw new ApiError(400, "No valid answers provided");
    }

    quiz.submissions.push({
        student: req.user._id,
        answers: processedAnswers,
        timeTaken,
        score,
        submittedAt: new Date(),
    });

    await quiz.save();

    await Analysis.create({
        quiz: quiz._id,
        student: req.user._id,
        score,
        confidenceAnalysis
    });

    return res.status(200).json(new ApiResponse(200, { score }, "Quiz submitted successfully"));
});




/**
 * @desc Fetch quiz attempts (Teachers only)
 * @route GET /api/quizzes/:quizId/attempts
 * @access Private (Teacher)
 */
export const getQuizAttempts = asyncHandler(async (req, res) => {
    if (req.user.userType !== "teacher") {
        throw new ApiError(403, "Only teachers can view quiz attempts");
    }

    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate("attempts.student", "fullname email");

    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    if (quiz.teacher.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only view attempts for your own quizzes");
    }

    return res.status(200).json(new ApiResponse(200, quiz.attempts, "Quiz attempts fetched successfully"));
});



/**
 * @desc Get quiz details (both teacher & student)
 * @route GET /api/quizzes/:quizId
 * @access Private
 */
export const getQuizDetails = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    return res.status(200).json(new ApiResponse(200, quiz, "Quiz details fetched successfully"));
});



/**
 * @desc Auto-submit quiz (when time expires or tab-switch detected)
 * @route POST /api/quizzes/auto-submit
 * @access Private (Student)
 */
export const autoSubmitQuiz = asyncHandler(async (req, res) => {
    if (req.user.userType !== "student") {
        throw new ApiError(403, "Only students can auto-submit quizzes");
    }

    const { quizId, answers, confidenceLevels, timeTaken } = req.body;

    if (!quizId || !answers || !confidenceLevels || timeTaken == null) {
        throw new ApiError(400, "All fields are required");
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
        if (q.correctAnswer === answers[i]) {
            score += 1;
        }
    });

    const attempt = {
        student: req.user._id,
        answers,
        confidenceLevels,
        timeTaken,
        score,
        autoSubmitted: true,
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    return res.status(200).json(new ApiResponse(200, attempt, "Quiz auto-submitted successfully"));
});

export const trackProctoringEvent = asyncHandler(async (req, res) => {
    if (req.user.userType !== "student") {
        throw new ApiError(403, "Only students can trigger proctoring events");
    }

    const { quizId } = req.body;
    if (!quizId) {
        throw new ApiError(400, "Quiz ID is required");
    }

    let proctoring = await Proctoring.findOne({ quiz: quizId, student: req.user._id });

    if (!proctoring) {
        proctoring = await Proctoring.create({
            quiz: quizId,
            student: req.user._id,
            tabSwitchCount: 1,
            lastDetected: new Date()
        });
    } else {
        proctoring.tabSwitchCount += 1;
        proctoring.lastDetected = new Date();
        await proctoring.save();
    }

    // If tab switches exceed 3, auto-submit the quiz
    if (proctoring.tabSwitchCount >= 3) {
        req.body.autoSubmitted = true; // Mark as auto-submitted
        await submitQuiz(req, res);
        return;
    }

    return res.status(200).json(new ApiResponse(200, proctoring, "Proctoring event recorded"));
});
