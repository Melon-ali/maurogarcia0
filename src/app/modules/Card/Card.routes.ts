import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CardController } from "./Card.controller";
import { CardValidation } from "./Card.validation";

const router = express.Router();

router.post(
  "/create-card/:userId",
  auth(),
  // validateRequest(CardValidation.createSchema),
  CardController.createCard
);

router.get("/", auth(), CardController.getCardList);

router.get("/:id", auth(), CardController.getCardById);

router.put(
  "/:id",
  auth(),
  validateRequest(CardValidation.updateSchema),
  CardController.updateCard
);

router.delete("/:id", auth(), CardController.deleteCard);

export const CardRoutes = router;
