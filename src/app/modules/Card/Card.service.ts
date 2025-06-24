import prisma from "../../../shared/prisma";

const createIntoDb = async (data: any) => {
    const result = await prisma.card.create({ data });
    return result;
  
};

const getListFromDb = async () => {
  
    const result = await prisma.card.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.card.findUnique({ where: { id } });
    if (!result) {
      throw new Error('card not found');
    }
    return result;
  };



const updateIntoDb = async (id: string, data: any) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.card.update({
      where: { id },
      data,
    });
    return result;
  });

  return transaction;
};

const deleteItemFromDb = async (id: string) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    const deletedItem = await prisma.card.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  });

  return transaction;
};
;

export const CardService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};