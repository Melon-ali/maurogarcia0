import httpStatus from "http-status";
import { AgentService } from "./Agent.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAgent, UpdateAgentInput } from "./Agent.interface";
import ApiError from "../../../errors/ApiErrors";
import { fileUploader } from "../../../helpars/fileUploader";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { agentFilterableFields } from "./Agent.constant";

const createAgent = catchAsync(async (req: Request, res: Response) => {
  const agentData: IAgent = JSON.parse(req.body.text);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files?.file?.[0];

  if (!file) {
    throw new ApiError(400, "No Agent Image Uploaded");
  }

  const uploadResult = await fileUploader.uploadToCloudinary(file);
  const fileUrl = uploadResult?.Location;

  agentData.image = fileUrl;

  const agents = await AgentService.createIntoDb(agentData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Agent created successfully",
    data: agents,
  });
});

const getAgentList = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page"]);
  const filters = pick(req.query, agentFilterableFields);
  const agents = await AgentService.getListFromDb( options, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent list retrieved successfully",
    meta: agents.meta,
    data: agents.data,
  });
});

const blockAgent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const status = req.body.status;
  const result = await AgentService.blockAgent(id, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent blocked successfully",
    data: result,
  });
});

const getAgentById = catchAsync(async (req, res) => {
  const result = await AgentService.getByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent details retrieved successfully",
    data: result,
  });
});

const updateAgent = catchAsync(async (req, res) => {

  const { id } = req.params;
  
    // Parse apartment update data sent as JSON string under `text` field
    const agentData: UpdateAgentInput = JSON.parse(req.body.text || "{}");
  
    // Get uploaded file (Multer stores it in `req.files`)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file = files?.profile?.[0];
  
    let fileUrl: string | undefined;
  
    // Upload file if exists
    if (file) {
      const uploadResult = await fileUploader.uploadToDigitalOcean(file);
      fileUrl = uploadResult?.Location;
    }
  

  const result = await AgentService.updateIntoDb(id, fileUrl, agentData);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent updated successfully",
    data: result,
  });
});

const deleteAgent = catchAsync(async (req, res) => {
  const result = await AgentService.deleteItemFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent deleted successfully",
    data: result,
  });
});

export const AgentController = {
  createAgent,
  getAgentList,
  blockAgent,
  getAgentById,
  updateAgent,
  deleteAgent,
};
