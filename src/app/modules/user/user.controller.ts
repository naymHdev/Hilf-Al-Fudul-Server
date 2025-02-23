import { StatusCodes } from 'http-status-codes';
import configs from '../../configs';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUser(req.body);

  const { refreshToken, accessToken } = result;

  //   res.cookie('refreshToken', refreshToken, {
  //     secure: configs.NODE_ENV === 'production',
  //     httpOnly: true,
  //     sameSite: 'none',
  //     maxAge: 1000 * 60 * 60 * 24 * 365,
  //   });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User registration completed successfully!',
    data: {},
  });
});

export const UserController = {
  registerUser,
};
