import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AgentController } from "./Agent.controller";
import { AgentValidation } from "./Agent.validation";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-agent",
  fileUploader.uploadApartmentImages,
  auth(UserRole.SUPER_ADMIN),
  // validateRequest(AgentValidation.createSchema),
  AgentController.createAgent
);

router.get("/", auth(UserRole.SUPER_ADMIN), AgentController.getAgentList);

// router.put("/toggle-all-agents-access", auth(UserRole.SUPER_ADMIN), AgentController.toggleAllAgentsAccess);

router.put("/block/:id", auth(UserRole.SUPER_ADMIN), AgentController.blockAgent);

router.get("/:id", auth(), AgentController.getAgentById);

router.put(
  "/:id",
  fileUploader.uploadApartmentImages,
  auth(UserRole.SUPER_ADMIN),
  //   validateRequest(AgentValidation.updateSchema),
  AgentController.updateAgent
);

router.delete("/:id", auth(UserRole.SUPER_ADMIN), AgentController.deleteAgent);

export const AgentRoutes = router;
