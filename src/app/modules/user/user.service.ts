import { StatusCodes } from 'http-status-codes';
import { IUser, UserRole } from './user.interface';
import User from './user.model';
import AppError from '../../errors/appError';
import mongoose from 'mongoose';
import { AuthService } from '../auth/auth.service';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';

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

    return await AuthService.loginUser({
      email: createdUser.email,
      password: userData.password,
      clientInfo: userData.clientInfo,
    });
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

const getAllUser = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await UserQuery.modelQuery;
  const meta = await UserQuery.countTotal();
  return {
    result,
    meta,
  };
};

export const UserServices = {
  registerUser,
  getAllUser,
};
