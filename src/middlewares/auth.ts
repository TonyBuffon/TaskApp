import jwt, { Secret } from "jsonwebtoken";
import catchAsync from "./../utils/catchAsync";
import AppError from "./../utils/AppError";
import { promisify } from "util";
import { CustomRequest } from "global";
import { Response, NextFunction } from "express";
import User from "../models/UsersModel";

export default catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    // 2) Verification token
    // @ts-ignore
    // @ts-nocheck
    const decoded: any = await promisify(jwt.verify)(token,process.env.JWT_SECRET as Secret);

    // 3) Check if user still existis

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    //  GRANT ACCESS TO PROTECTED ROUTES
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  }
);
