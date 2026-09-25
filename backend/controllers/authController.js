import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";

export async function submitSignup(req, res, next) {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
      // Return only public account fields; never include the stored password hash in the API response.
      select: { id: true, username: true, isAdmin: true },
    });

    return res.status(201).json({ user });
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

export function submitLogout(req, res) {
  // JWTs are stateless, so the client clears its saved token after this acknowledgment.
  return res.sendStatus(204);
}
