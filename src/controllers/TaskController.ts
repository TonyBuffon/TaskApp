import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "global";
import mongoose from "mongoose";
import { ITask, Task } from "../models/TasksModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export const getAllTasks = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const tasks: ITask[] = await Task.find({ creator: userId });
    res.status(200).json({
      status: "success",
      tasks,
    });
  }
);

export const getTask = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const taskId = req.params.id;

    const task: ITask = await Task.findOne({
      _id: taskId,
      creator: req.user.id,
    });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    res.status(200).json({
      status: "success",
      task,
    });
  }
);

export const createTask = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const task: any = await Task.create({
      ...req.body,
      creator: req.user.id,
    });
    res.status(201).json({
      status: "success",
      task,
    });
  }
);

export const editTask = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["task", "completed"];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
      return next(new AppError("Invalid Updates", 400));
    }

    const task: any = await Task.findOne({
      _id: req.params.id,
      creator: req.user.id,
    });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).json({
      status: "success",
      task,
    });
  }
);

export const deleteTask = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const task: any = await Task.findByIdAndDelete({
      _id: req.params.id,
      creator: req.user.id,
    });
    if (!task) {
      return next(new AppError("Task not found", 404));
    }
    res.status(204).json({ status: "success", task });
  }
);
