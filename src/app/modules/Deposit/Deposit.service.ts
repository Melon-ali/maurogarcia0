import prisma from "../../../shared/prisma";



const createIntoDb = async (data: any) => {
    const result = await prisma.deposit.create({ data });
    return result;
  
};

const getListFromDb = async () => {
  
    const result = await prisma.deposit.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.deposit.findUnique({ where: { id } });
    if (!result) {
      throw new Error('deposit not found');
    }
    return result;
  };



const updateIntoDb = async (id: string, data: any) => {
    const result = await prisma.deposit.update({
      where: { id },
      data,
    });
    return result;
  
};

const deleteItemFromDb = async (id: string) => {
    const deletedItem = await prisma.deposit.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  
};
;

export const DepositService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};