import httpStatus from 'http-status';
import { CardService } from './Card.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';

const createCard = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const cardData = {
    userId, 
    cardNumber: req.body.cardNumber,
    cardHolder: req.body.cardHolder,
    expiryDate: req.body.expiryDate,
    cvv: req.body.cvv,
  };

  const result = await CardService.createIntoDb(cardData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Card created successfully",
    data: result,
  });
});

const getCardList = catchAsync(async (req, res) => {
  const result = await CardService.getListFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card list retrieved successfully',
    data: result,
  });
});

const getCardById = catchAsync(async (req, res) => {
  const result = await CardService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card details retrieved successfully',
    data: result,
  });
});

const updateCard = catchAsync(async (req, res) => {
  const result = await CardService.updateIntoDb(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card updated successfully',
    data: result,
  });
});

const deleteCard = catchAsync(async (req, res) => {
  const result = await CardService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card deleted successfully',
    data: result,
  });
});

export const CardController = {
  createCard,
  getCardList,
  getCardById,
  updateCard,
  deleteCard,
};