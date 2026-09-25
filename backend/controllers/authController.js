import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";

export async function submitSignup(req, res, next) {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).send("You need a pw and un, bozo");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

export function submitLogin(req, res, next) {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        error: info?.message ?? "Incorrect username or password",
      });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1hr",
    });

    return res.json({
      token,
      user: {
        id: String(user.id),
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  })(req, res, next);
}

export async function submitLogout(req, res, next) {
    req.logout((error) => {
        if (error) return next(error);
        res.redirect("/collection")
    })
}
