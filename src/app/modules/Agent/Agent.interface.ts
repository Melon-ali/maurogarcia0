import { Gender } from "@prisma/client";

export interface IAgent {
  id: string; // user.id
  agentId: string; // agent.id
  userName: string; // user.username
  email: string; // user.email
  gender: string; // agent.gender (assuming string enum or string)
  contactNumber: string; // agent.contactNumber
  assignedArea: string; // agent.assignedArea
  socialLinks?: Record<string, string> | ""; // agent.socialLinks (JSON object)
  image?: string | null; // agent.image (optional)
  dashboard: boolean; // agent.dashboard
  allAgents: boolean; // agent.allAgents
  allClients: boolean; // agent.allClients
  allProperties: boolean; // agent.allProperties
  withdraw: boolean; // agent.withdraw
  return: boolean; // agent.return
  message: boolean; // agent.message
  profile: boolean; // agent.profile
  description: string; // agent.description
  NIDNumber: number; // agent.NIDNumber
  address: string; // agent.address
  realStatelicenseNumber: number; // agent.realStatelicenseNumber
  createdAt: Date; // agent.createdAt
  updatedAt: Date; // agent.updatedAt
}

export interface UpdateAgentInput {
  uername?: string;
  gender?: Gender;
  contactNumber?: string;
  assignedArea?: string;
  socialLinks?: any;
  description?: string;
  NIDNumber?: number;
  address?: string;
  realStatelicenseNumber?: number;
  status?: AgentStatus;
  dashboard?: boolean;
  allAgents?: boolean;
  allClients?: boolean;
  allProperties?: boolean;
  withdraw?: boolean;
  return?: boolean;
  message?: boolean;
  profile?: boolean;
}

enum AgentStatus {
  ACTIVE,
  INACTIVE,
  BLOCKED,
}


export type IAgentFilterRequest = {
  agentName?: string | undefined;
  searchTerm?: string | undefined;
};
