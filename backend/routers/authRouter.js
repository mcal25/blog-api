import { Router } from "express";
import { submitSignup, submitLogin, submitLogout } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", submitSignup);
authRouter.post("/login", submitLogin);
authRouter.post("/logout", submitLogout);