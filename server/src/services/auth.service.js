
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  findUserById,
  createUserWithPortfolio,
} from "../repositories/user.repository.js";
import { env } from "../config/env.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateToken = (userId) =>
  jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: "1d",
  });

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createError("An account with this email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  let user;

  try {
    user = await createUserWithPortfolio({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });
  } catch (error) {
    // Handles concurrent registration attempts for the same email.
    if (error.code === "P2002") {
      throw createError("An account with this email already exists.", 409);
    }

    throw error;
  }

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw createError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw createError("Invalid email or password.", 401);
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw createError("User not found.", 404);
  }

  return user;
};
