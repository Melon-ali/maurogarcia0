import prisma from "../../../shared/prisma";



const createIntoDb = async (data: any) => {
    const result = await prisma.withdraw.create({ data });
    return result;
  
};

const getListFromDb = async () => {
  
    const result = await prisma.withdraw.findMany();
    return result;
};

const getByIdFromDb = async (id: string) => {
  
    const result = await prisma.withdraw.findUnique({ where: { id } });
    if (!result) {
      throw new Error('withdraw not found');
    }
    return result;
  };



const updateIntoDb = async (id: string, data: any) => {
    const result = await prisma.withdraw.update({
      where: { id },
      data,
    });
    return result;
 
};

const deleteItemFromDb = async (id: string) => {
    const deletedItem = await prisma.withdraw.delete({
      where: { id },
    });

    // Add any additional logic if necessary, e.g., cascading deletes
    return deletedItem;
  
};
;

export const WithdrawService = {
createIntoDb,
getListFromDb,
getByIdFromDb,
updateIntoDb,
deleteItemFromDb,
};