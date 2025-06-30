import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import {
  IAgent,
  IAgentFilterRequest,
  UpdateAgentInput,
} from "./Agent.interface";
import * as bcrypt from "bcrypt";
import { agentSearchableFields } from "./Agent.constant";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { fileUploader } from "../../../helpars/fileUploader";
import config from "../../../config";

const createAgentFormDb = async (req: any) => {
  let parsedData;

  // auto detect request format
  if (typeof req.body === "string") {
    parsedData = JSON.parse(req.body);
  } else if (req.body?.data && typeof req.body.data === "string") {
    parsedData = JSON.parse(req.body.data);
  } else if (typeof req.body === "object") {
    parsedData = req.body;
  } else {
    throw new Error("Invalid request body format.");
  }

  // handle file
  let image = ""; 
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file = files?.file?.[0];
    if (file) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      image = uploadResult?.Location || "";
    }
  }

  const hashedPassword = await bcrypt.hash(
    parsedData.password,
    Number(config.bcrypt_salt_rounds)
  );

  const user = await prisma.user.create({
    data: {
      email: parsedData.email,
      username: parsedData.username,
      password: hashedPassword,
      role: UserRole.AGENT,
      profileImage: image,
      profileUrl: parsedData.profileUrl,
      status: UserStatus.ACTIVE,
      isNotification: true,
    },
  });

  const agent = await prisma.agent.create({
    data: {
      userId: user.id,
      gender: parsedData.gender,
      contactNumber: parsedData.contactNumber,
      assignedArea: parsedData.assignedArea,
      socialLinks: parsedData.socialLinks,
      image: image,
      dashboard: parsedData.dashboard,
      allAgents: parsedData.allAgents,
      allClients: parsedData.allClients,
      allProperties: parsedData.allProperties,
      withdraw: parsedData.withdraw,
      return: parsedData.return,
      message: parsedData.message,
      profile: parsedData.profile,
      description: parsedData.description,
      NIDNumber: parsedData.NIDNumber,
      address: parsedData.address,
      realStatelicenseNumber: parsedData.realStatelicenseNumber,
    },
  });

  return {
    id: user.id,
    agentId: agent.id,
    userName: user.username,
    email: user.email,
    gender: agent.gender,
    contactNumber: agent.contactNumber,
    assignedArea: agent.assignedArea,
    socialLinks: agent.socialLinks,
    image: agent.image,
    dashboard: agent.dashboard,
    allAgents: agent.allAgents,
    allClients: agent.allClients,
    allProperties: agent.allProperties,
    withdraw: agent.withdraw,
    return: agent.return,
    message: agent.message,
    profile: agent.profile,
    description: agent.description,
    NIDNumber: agent.NIDNumber,
    address: agent.address,
    realStatelicenseNumber: agent.realStatelicenseNumber,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
  };
};

const getListFromDb = async (
  options: IPaginationOptions,
  params: IAgentFilterRequest
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.AgentWhereInput[] = [];

  if (searchTerm) {
    andCondions.push({
      OR: agentSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.AgentWhereInput = {
    AND: [...andCondions],
  };

  const agents = await prisma.agent.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.agent.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: agents,
  };
};

const blockAgent = async (id: string, status: any) => {
  const agent = await prisma.agent.findUnique({ where: { id } });
  if (!agent) {
    throw new Error("agent not found");
  }
  const result = await prisma.agent.update({
    where: { id: agent.id },
    data: {
      status,
    },
  });
  return result;
};

// const toggleAllAgentsAccess = async () => {
//   const allAgents = await prisma.agent.findMany();

//   const updatedAgents = await Promise.all(
//     allAgents.map(agent =>
//       prisma.agent.update({
//         where: { id: agent.id },
//         data: { isAccess: !agent.isAccess },
//       })
//     )
//   );

//   return updatedAgents;
// };

const getByIdFromDb = async (id: string) => {
  const result = await prisma.agent.findUnique({ where: { id } });
  if (!result) {
    throw new Error("agent not found");
  }
  return result;
};

const updateIntoDb = async (req: any) => {
  const id = req.params.id;
  const rawData = req.body.data;

  // Parse JSON string if necessary
  let parsedData: any;
  if (typeof rawData === "string") {
    parsedData = JSON.parse(rawData);
  } else {
    parsedData = rawData;
  }

  const existingAgent = await prisma.agent.findUnique({
    where: { id },
  });
  if (!existingAgent) {
    throw new ApiError(404, "Agent not found");
  }

  // handle file
  let image = "";
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file = files?.file?.[0];
    if (file) {
      const uploadResult = await fileUploader.uploadToCloudinary(file);
      image = uploadResult?.Location || "";
    }
  }

  // Build Agent update fields
  const agentUpdateData: Prisma.AgentUpdateInput = {
    ...(parsedData.gender && { gender: { set: parsedData.gender } }),
    ...(parsedData.status && { status: { set: parsedData.status } }),
    contactNumber: parsedData.contactNumber,
    assignedArea: parsedData.assignedArea,
    socialLinks: parsedData.socialLinks,
    description: parsedData.description,
    NIDNumber: parsedData.NIDNumber,
    address: parsedData.address,
    realStatelicenseNumber: parsedData.realStatelicenseNumber,
    dashboard: parsedData.dashboard,
    allAgents: parsedData.allAgents,
    allClients: parsedData.allClients,
    allProperties: parsedData.allProperties,
    withdraw: parsedData.withdraw,
    return: parsedData.return,
    message: parsedData.message,
    profile: parsedData.profile,
    ...(image && { image }),
  };

  // If any user fields are included
  if (parsedData.email || parsedData.username || parsedData.password) {
    agentUpdateData.user = {
      update: {
        ...(parsedData.email && { email: parsedData.email }),
        ...(parsedData.username && { username: parsedData.username }),
        ...(parsedData.password && {
          password: await bcrypt.hash(
            parsedData.password,
            Number(config.bcrypt_salt_rounds)
          ),
        }),
      },
    };
  }

  const result = await prisma.agent.update({
    where: { id },
    data: agentUpdateData,
    select: {
      id: true,
      gender: true,
      contactNumber: true,
      assignedArea: true,
      socialLinks: true,
      image: true,
      description: true,
      NIDNumber: true,
      address: true,
      realStatelicenseNumber: true,
      status: true,
      dashboard: true,
      allAgents: true,
      allClients: true,
      allProperties: true,
      withdraw: true,
      return: true,
      message: true,
      profile: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  return result;
};

const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.agent.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};
export const AgentService = {
  createAgentFormDb,
  getListFromDb,
  blockAgent,
  // toggleAllAgentsAccess,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
