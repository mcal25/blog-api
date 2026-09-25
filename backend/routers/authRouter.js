import { Router } from "express";
import { submitSignup, submitLogin, submitLogout } from "../controllers/authController.js";
import passport from "passport";

export const authRouter = Router();
const requireJwt = passport.authenticate("jwt", { session: false });

authRouter.post("/signup", submitSignup);
authRouter.post("/login", submitLogin);
// Require a currently valid token so Postman only clears tokens that logged in successfully.
authRouter.post("/logout", requireJwt, submitLogout);