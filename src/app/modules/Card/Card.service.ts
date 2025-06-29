import prisma from "../../../shared/prisma";
import { CreateCardInput } from "./Card.interface";

const createIntoDb = async (cardData: CreateCardInput) => {
  const result = await prisma.card.create({
    data: {
      userId: cardData.userId,
      cardNumber: cardData.cardNumber,
      cardHolder: cardData.cardHolder,
      expiryDate: cardData.expiryDate,
      cvv: cardData.cvv,
    },
    select: { 
      id: true, 
      userId: true,
      cardNumber: true,
      cardHolder: true,
      expiryDate: true,
      cvv: true,
    },
  });
  return result;
};

const getListFromDb = async () => {
  const result = await prisma.card.findMany();
  return result;
};

const getByIdFromDb = async (id: string) => {
  const result = await prisma.card.findUnique({ where: { id } });
  if (!result) {
    throw new Error("card not found");
  }
  return result;
};

const updateIntoDb = async (id: string, data: any) => {
  const result = await prisma.card.update({
    where: { id },
    data,
  });
  return result;
};

const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.card.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};
export const CardService = {
  createIntoDb,
  getListFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
