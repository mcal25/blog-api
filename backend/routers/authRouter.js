import { Router } from "express";
import { submitSignup, submitLogin } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", submitSignup);
authRouter.post("/login", submitLogin);
