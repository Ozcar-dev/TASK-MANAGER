import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import User from "../models/user";
import transporter from "../config/email";

// REGISTER
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already in use" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const signOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      signOptions
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const signOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      signOptions
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
    console.log("forgotPassword route hit")
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "No account found with that email" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your TaskDuty Password",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password. Click the link below to set a new one:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link expires in 15 minutes. If you didn't request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
