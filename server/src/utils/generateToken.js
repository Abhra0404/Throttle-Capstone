
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const generateToken = (userId) => {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: "1d",
  });
};

export default generateToken;
