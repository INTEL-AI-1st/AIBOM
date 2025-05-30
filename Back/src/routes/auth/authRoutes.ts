import express from "express";
import { register, login, auth, getUser } from "@controllers/auth/authController";
import { authenticateJWT } from "@middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/auth", authenticateJWT, auth);
authRouter.post("/getUser", authenticateJWT, getUser);
export default authRouter;
