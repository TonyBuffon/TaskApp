import User, { IUser } from "../models/UsersModel";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { Response, NextFunction } from "express";
import { ObjectId } from "mongoose";
import { Task } from "../models/TasksModel";
import { CustomRequest } from "global";
const signToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const id: string = user.id.toString();
  const token = signToken(id);

  user.password = undefined;

  res.status(statusCode).json({ user, token });
};

export const signup = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const newUser: any = await User.create(req.body);
    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //  Check if email & password exist

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    const user: any = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    console.log(user);

    createSendToken(user, 200, res);
  }
);

export const getMe = (req: CustomRequest, res: Response) => {
  const user: any = req.user;
  res.status(200).json({
    status: "Success",
    user,
  });
};
export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "age", "password"];
    let user: any = req.user;
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
      return next(new AppError("Invalid updates.", 400));
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save({
      new: true,
      runValidators: true,
    });
    res.status(200).json({ user: req.user });
  }
);

export const deleteUser = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    await Task.deleteMany({ creator: user.id });
    await User.findByIdAndDelete(user.id);
    res.status(204).json({ user });
  }
);
