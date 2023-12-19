import { Schema, Types, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser {
  id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      require: [true, "Enter your name"],
      trim: true,
      minlength: [2, "Please enter a name with at least two characters"],
    },
    email: {
      type: String,
      require: [true, "Enter your email"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Create password DUDE!!!"],
      minlength: [8, "Enter at least 8 characters :)"],
      trim: true,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtuals
UserSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "creator",
});

// Pre Methods
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
  next();
});

// Methods
UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changeTimestamp = Math.round(
      (this.passwordChangedAt.getTime() / 1000) * 10
    );

    return JWTTimestamp < changeTimestamp;
  } else {
    return false;
  }
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model("Users", UserSchema);

export default User;
