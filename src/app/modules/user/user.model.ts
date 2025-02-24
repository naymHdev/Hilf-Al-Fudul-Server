/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserModel, UserRole } from './user.interface';
import configs from '../../configs';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../errors/appError';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.USER],
      default: UserRole.USER,
    },
    hasCharity: { type: Boolean, default: false },
    clientInfo: {
      device: { type: String, enum: ['pc', 'mobile'], required: true },
      browser: { type: String, required: true },
      ipAddress: { type: String, required: true },
      pcName: { type: String },
      os: { type: String },
      userAgent: { type: String },
    },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    otpToken: { type: String, default: null },
  },
  { timestamps: true },
);

// 🔒 Hash Password Before Saving
userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(configs.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.checkUserExist = async function (userId: string) {
  const existingUser = await this.findById(userId);

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User does not exist!');
  }

  if (!existingUser.isActive) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User is not active!');
  }

  return existingUser;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
