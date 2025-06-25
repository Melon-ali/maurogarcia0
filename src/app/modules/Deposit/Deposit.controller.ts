import httpStatus from 'http-status';
import { DepositService } from './Deposit.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';

const createDeposit = catchAsync(async (req: Request, res:Response) => {
  const result = await DepositService.createIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Deposit created successfully',
    data: result,
  });
});

const getDepositList = catchAsync(async (req, res) => {
  const result = await DepositService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit list retrieved successfully',
    data: result,
  });
});

const getDepositById = catchAsync(async (req, res) => {
  const result = await DepositService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit details retrieved successfully',
    data: result,
  });
});

const updateDeposit = catchAsync(async (req, res) => {
  const result = await DepositService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit updated successfully',
    data: result,
  });
});

const deleteDeposit = catchAsync(async (req, res) => {
  const result = await DepositService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit deleted successfully',
    data: result,
  });
});

export const DepositController = {
  createDeposit,
  getDepositList,
  getDepositById,
  updateDeposit,
  deleteDeposit,
};