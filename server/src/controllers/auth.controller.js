
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: result,
  });
};

export const login = async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: result,
  });
};

export const me = async (req, res) => {
  const user = await getCurrentUser(req.user.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
};
