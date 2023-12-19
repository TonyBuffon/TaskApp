import mongoose from "mongoose";
import { IUser } from "./UsersModel";

export interface ITask {
  task: string;
  creator: mongoose.ObjectId | IUser;
  completed: boolean;
}

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, "Enter your task!"],
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Task = mongoose.model("Task", taskSchema);
