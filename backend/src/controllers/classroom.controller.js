import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Classroom } from "../models/classroom.model.js";
import { User } from "../models/user.model.js";


const generateClassCode = async () => {
    let classCode;
    let existingClass;
    do {
        classCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        existingClass = await Classroom.findOne({ classCode });
    } while (existingClass);
    return classCode;
};


const createClassroom = asyncHandler (async (req, res) => {
    if (req.user.userType !== "teacher") {
        throw new ApiError(403, "Only teachers can create classrooms");
    }

    const { name, description } = req.body;
    if (!name) {
        throw new ApiError(400, "Classroom name is required");
    }

    const classCode = await generateClassCode();

    const classroom = await Classroom.create({
        name,
        teacher: req.user._id,
        description,
        classCode,
    });

    return res.status(201).json(new ApiResponse(201, classroom, "Classroom created successfully"));
});


const joinClassroom = asyncHandler(async (req, res) => {
    if (req.user.userType !== "student") {
        throw new ApiError(403, "Only students can join classrooms");
    }

    const { classCode, studentId } = req.body;
    if (!classCode) {
        throw new ApiError(400, "Class code is required");
    }

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    if (classroom.students.includes(req.user._id)) {
        throw new ApiError(400, "You have already joined this classroom");
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    return res.status(200).json(new ApiResponse(200, classroom, "Joined classroom successfully"));
});


const getUserClassrooms = asyncHandler( async (req, res) => {
    let classrooms;

    if (req.user.userType === "teacher") {
        classrooms = await Classroom.find({ teacher: req.user._id }).populate("students", "fullname email");
    } else {
        classrooms = await Classroom.find({ students: req.user._id }).populate("teacher", "fullname email");
    }

    return res.status(200).json(new ApiResponse(200, classrooms, "User classrooms fetched successfully"));
});


const leaveClassroom = asyncHandler(async (req, res) => {
    if (req.user.userType !== "student") {
        throw new ApiError(403, "Only students can leave classrooms");
    }
    const { classCode} = req.body;
    if (!classCode) {
        throw new ApiError(400, "Class code is required");
    }

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    // Remove student from the classroom
    classroom.students = classroom.students.filter(studentId => studentId.toString() !== req.user._id.toString());
    await classroom.save();

    return res.status(200).json(new ApiResponse(200, classroom, "Left classroom successfully"));
});


const removeStudent = asyncHandler(async (req, res) => {
    if (req.user.userType !== "teacher") {
        throw new ApiError(403, "Only teachers can remove students from classrooms");
    }

    const { classCode, email } = req.body;
    if (!classCode || !email) {
        throw new ApiError(400, "Class code and student ID are required");
    }

    const classroom = await Classroom.findOne({ classCode });
    const curr = await User.findOne({ email });
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only remove students from your own classrooms");
    }

    classroom.students = classroom.students.filter(id => id.toString() !== curr._id.toString());
    await classroom.save();

    return res.status(200).json(new ApiResponse(200, classroom, "Student removed from classroom"));
});


const deleteClassroom = asyncHandler(async (req, res) => {
    if (req.user.userType !== "teacher") {
        throw new ApiError(403, "Only teachers can delete classrooms");
    }

    const { classCode } = req.params;

    if (!classCode) {
        throw new ApiError(400, "Class code is required");
    }

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    if (classroom.teacher.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own classrooms");
    }

    await Classroom.deleteOne({ _id: classroom._id });

    return res.status(200).json(new ApiResponse(200, {}, "Classroom deleted successfully"));
});

export {
    createClassroom,
    joinClassroom,
    getUserClassrooms,
    leaveClassroom,
    removeStudent,
    deleteClassroom
};
