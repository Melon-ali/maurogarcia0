import httpStatus from 'http-status';

import { WithdrawService } from './Withdraw.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createWithdraw = catchAsync(async (req, res) => {
  const result = await WithdrawService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Withdraw created successfully',
    data: result,
  });
});

const getWithdrawList = catchAsync(async (req, res) => {
  const result = await WithdrawService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw list retrieved successfully',
    data: result,
  });
});

const getWithdrawById = catchAsync(async (req, res) => {
  const result = await WithdrawService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw details retrieved successfully',
    data: result,
  });
});

const updateWithdraw = catchAsync(async (req, res) => {
  const result = await WithdrawService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw updated successfully',
    data: result,
  });
});

const deleteWithdraw = catchAsync(async (req, res) => {
  const result = await WithdrawService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw deleted successfully',
    data: result,
  });
});

export const WithdrawController = {
  createWithdraw,
  getWithdrawList,
  getWithdrawById,
  updateWithdraw,
  deleteWithdraw,
};