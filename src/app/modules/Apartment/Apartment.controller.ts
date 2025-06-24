import httpStatus from "http-status";
import { ApartmentService } from "./Apartment.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IApartment, UpdatePropertyInput } from "./Apartment.interface";
import { fileUploader } from "../../../helpars/fileUploader";
import ApiError from "../../../errors/ApiErrors";
import pick from "../../../shared/pick";
import { apartmentFilterableFields } from "./Apartment.constant";

const createApartment = catchAsync(async (req: Request,  res: Response) => {
  const apartmentData: IApartment = JSON.parse(req.body.text);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files?.file?.[0];

  if (!file) {
    throw new ApiError(400, "No Apartment Image Uploaded");
  }

  const uploadResult = await fileUploader.uploadToCloudinary(file);
  const fileUrl = uploadResult?.Location;

  apartmentData.image = fileUrl;

  const result = await ApartmentService.createIntoDb(
    apartmentData
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Apartment created successfully",
    data: result,
  });
});

const getApartmentList = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page"]);
  const filters = pick(req.query, apartmentFilterableFields);
  const apartments = await ApartmentService.getListFromDb(options, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Apartment list retrieved successfully",
    meta: apartments.meta,
    data: apartments.data,
  });
});



const getDashboardCount = catchAsync(async (req, res) => {
  const result = await ApartmentService.getDashboardCount();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard count retrieved successfully",
    data: result,
  });
});

const getApartmentById = catchAsync(async (req, res) => {
  const result = await ApartmentService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Apartment details retrieved successfully",
    data: result,
  });
});

const updateApartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Parse apartment update data sent as JSON string under `text` field
  const propertyData: UpdatePropertyInput = JSON.parse(req.body.text || "{}");

  // Get uploaded file (Multer stores it in `req.files`)
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files?.profile?.[0];

  let fileUrl: string | undefined;

  // Upload file if exists
  if (file) {
    const uploadResult = await fileUploader.uploadToDigitalOcean(file);
    fileUrl = uploadResult?.Location;
  }

  // Update apartment data and optionally image
  const result = await ApartmentService.updateIntoDb(id, fileUrl, propertyData);

  // Send success response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Apartment updated successfully",
    data: result,
  });
});


const deleteApartment = catchAsync(async (req, res) => {
  const result = await ApartmentService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Apartment deleted successfully",
    data: result,
  });
});

export const ApartmentController = {
  createApartment,
  getApartmentList,
  getDashboardCount,
  getApartmentById,
  updateApartment,
  deleteApartment,
};