import { StatusCodes } from 'http-status-codes';
import { IUser, UserRole } from './user.interface';
import User from './user.model';
import AppError from '../../errors/appError';
import mongoose from 'mongoose';

const registerUser = async (userData: IUser) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if ([UserRole.ADMIN].includes(userData.role)) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        'Invalid role. Only User is allowed.',
      );
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: userData.email }).session(
      session,
    );
    if (existingUser) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        'Email is already registered',
      );
    }

    // Create the user
    const user = new User(userData);
    const createdUser = await user.save({ session });

    await session.commitTransaction();
    return createdUser;
  } catch (error) {
    console.log(error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

export const UserServices = {
  registerUser,
};
