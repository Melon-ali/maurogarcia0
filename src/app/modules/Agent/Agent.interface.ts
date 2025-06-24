export interface IAgent {
  id?: string;
  agentName?: string;
  role?: "AGENT"; // since default is AGENT
  image?: string;
  gender?: "MALE" | "FEMALE" | "OTHER"; // based on your Gender enum
  contactNumber?: string;
  agentArea?: string;
  socialLinks?: string; 
  dashboardAccess?: "YES" | "NO"; // based on your DashboardAccess enum
  description?: string;
  NIDNumber?: number;
  email?: string;
  address?: string;
  realStatelicenseNumber?: number;
  createdAt?: string; // or Date
  updatedAt?: string; // or Date
}

export type UpdateAgentInput = Partial<IAgent>;


export type IAgentFilterRequest = {
  agentName?: string | undefined;
  searchTerm?: string | undefined;
};
