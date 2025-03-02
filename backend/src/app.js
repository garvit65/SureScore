import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from "./routes/user.routes.js";
import classroomRoutes from "./routes/classroom.routes.js";
import quizRoutes from "./routes/quiz.routes.js";


//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/classroom", classroomRoutes);
app.use("/api/v1/quiz", quizRoutes);

// http://localhost:3000/api/v1
// http://localhost:3000/api/v1/users
export { app };