import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ApartmentController } from "./Apartment.controller";
import { ApartmentValidation } from "./Apartment.validation";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-apartment",
  fileUploader.uploadApartmentImages,
  auth(UserRole.SUPER_ADMIN),
  // validateRequest(ApartmentValidation.createSchema),
  ApartmentController.createApartment
);

router.get("/", auth(), ApartmentController.getApartmentList);

router.get("/dashboard", auth(), ApartmentController.getDashboardCount);

router.get("/:id", auth(), ApartmentController.getApartmentById);

router.put(
  "/:id",
  fileUploader.uploadApartmentImages,
  auth(),
  // validateRequest(ApartmentValidation.updateSchema),
  ApartmentController.updateApartment
);

router.delete("/:id", auth(), ApartmentController.deleteApartment);

export const ApartmentRoutes = router;
