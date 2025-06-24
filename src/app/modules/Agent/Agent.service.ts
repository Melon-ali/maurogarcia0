import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import {
  IAgent,
  IAgentFilterRequest,
  UpdateAgentInput,
} from "./Agent.interface";
import { agentFilterableFields, agentSearchableFields } from "./Agent.constant";

const createIntoDb = async (agentData?: IAgent) => {
  const { id, createdAt, updatedAt, ...rest } = agentData || {};

  const result = await prisma.agent.create({
    data: {
      agentName: rest.agentName ?? "",
      role: "AGENT", // default and fixed
      image: rest.image ?? "",
      gender: rest.gender ?? "MALE",
      contactNumber: rest.contactNumber ?? "",
      agentArea: rest.agentArea ?? "",
      socialLinks: rest.socialLinks ?? "FACEBOOK",
      dashboardAccess: rest.dashboardAccess ?? "YES",
      description: rest.description ?? "",
      NIDNumber: rest.NIDNumber ?? 0,
      email: rest.email ?? "",
      address: rest.address ?? "",
      realStatelicenseNumber: rest.realStatelicenseNumber ?? 0,
    },
    select: {
      id: true,
      agentName: true,
      role: true,
      image: true,
      gender: true,
      contactNumber: true,
      agentArea: true,
      socialLinks: true,
      dashboardAccess: true,
      description: true,
      NIDNumber: true,
      email: true,
      address: true,
      realStatelicenseNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
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

const getByIdFromDb = async (id: string) => {
  const result = await prisma.agent.findUnique({ where: { id } });
  if (!result) {
    throw new Error("agent not found");
  }
  return result;
};

const updateIntoDb = async (
  id: string,
  fileUrl: string | undefined,
  agentsData: UpdateAgentInput
) => {
  const result = await prisma.agent.update({
    where: { id },
    data: {
      ...agentsData,
      ...(fileUrl && { image: fileUrl }), // Only set image if fileUrl exists
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
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
