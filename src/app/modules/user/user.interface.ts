/* eslint-disable no-unused-vars */
import { Document, Model } from 'mongoose';

// Enum for User Roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Interface for client information
interface IClientInfo {
  device: 'pc' | 'mobile'; // Device type
  browser: string; // Browser name
  ipAddress: string; // User IP address
  pcName?: string; // Optional PC name
  os?: string; // Optional OS name (Windows, MacOS, etc.)
  userAgent?: string; // Optional user agent string
}

// User Schema Definition
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  hasCharity: boolean;
  clientInfo: IClientInfo;
  lastLogin: Date;
  isActive: boolean;
  otpToken: string | null; // Explicitly set as nullable
  readonly createdAt: Date; // `readonly` to prevent manual modification
  updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserExistsByEmail(id: string): Promise<IUser>;
  checkUserExist(userId: string): Promise<IUser>;
}
