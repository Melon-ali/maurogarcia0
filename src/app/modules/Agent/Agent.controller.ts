import httpStatus from "http-status";
import { AgentService } from "./Agent.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { agentFilterableFields } from "./Agent.constant";

const createAgent = catchAsync(async (req: Request, res: Response) => {
  const agent = await AgentService.createAgentFormDb(req as any);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Agent created successfully",
    data: agent,
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

// const toggleAllAgentsAccess = catchAsync(async (req, res) => {
//   const result = await AgentService.toggleAllAgentsAccess();
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "All agents access toggled successfully",
//     data: result,
//   });
// });

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
  
  const updatedAgent = await AgentService.updateIntoDb(req as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent updated successfully",
    data: updatedAgent,
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
  // toggleAllAgentsAccess,
  getAgentById,
  updateAgent,
  deleteAgent,
};
