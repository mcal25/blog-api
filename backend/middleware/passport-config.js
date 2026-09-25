import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { getUserById } from "../db/queries.js";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export function configurePassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { username: username },
        });
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );
}

export function configureJWTStrategy() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await getUserById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }),
  );
}

export { passport };
