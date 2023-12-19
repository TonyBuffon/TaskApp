import { IUser } from "../models/UsersModel";

import { Request } from "express";
export interface CustomRequest extends Request {
  user?: IUser; // Type of your custom property
}
