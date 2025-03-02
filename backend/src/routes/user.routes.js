import { Router } from "express";
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails 
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js"; 

const router = Router()

// Public routes(No authentication required)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

// Protected routes (require authentication)
router.route("/logout").post(isAuthenticated, logoutUser)
router.route("/change-password").put(isAuthenticated, changeCurrentPassword)
router.route("/update-account").put(isAuthenticated, updateAccountDetails)


export default router