import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { JwtPayload } from "jsonwebtoken";

const toggleLike = async (id: string, user: any) => {
  const prismaTransaction = await prisma.$transaction(async (prisma) => {
    // Check if the post exists
    const isPostExist = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    if (!isPostExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }

    // Check if the favorite already exists for the user
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        apartmentId: id,
      },
    });

    let result;
    if (existingLike) {
      // If the like exists, remove the favorite and decrement likeCount
      result = await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Decrement the like count on the post
      await prisma.apartment.update({
        where: {
          id: id,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
    } else {
      // If the like doesn't exist, add the favorite and increment likeCount
      result = await prisma.like.create({
        data: {
          userId: user.id,
          apartmentId: id,
        },
      });

      // Increment the like count on the post
      await prisma.apartment.update({
        where: {
          id: id,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
    }
    
    return result;
  });

  return prismaTransaction;
};

const unlike = async (id: string, user: any) => {
  const isPostExist = await prisma.apartment.findUnique({
    where: { id },
  });

  if (!isPostExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: user.id,
      apartmentId: id,
    },
  });

  if (!existingLike) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Like does not exist");
  }

  await prisma.like.delete({
    where: { id: existingLike.id },
  });

  await prisma.apartment.update({
    where: { id },
    data: {
      likeCount: {
        decrement: 1,
      },
    },
  });

  return { message: "Unliked successfully", apartmentId: id };
};

const getAllMyLikeIds = async (user: JwtPayload) => {
  const findUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.like.findMany({
    where: {
      userId: user.id,
    },
    select: {
      apartment: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          bathrooms: true,
          bedrooms: true,
          sqft: true,
          price: true,
          latitude: true,
          longitude: true,
          country: true,
          subDivition: true,
          status: true,
          stories: true,
          yearBuilt: true,
          propertyType: true,
          MLS: true,
          maintenanceFee: true,
          // user: {
          //   select: {
          //     id: true,
          //     username: true,
          //   },
          // },
        },
      },  
    },
  });

  const likedCourses = result.map((like) => ({
    id: like.apartment.id,
    name: like.apartment.name,
    description: like.apartment.description,
    image: like.apartment.image,
    bathrooms: like.apartment.bathrooms,
    bedrooms: like.apartment.bedrooms,
    sqft: like.apartment.sqft,
    price: like.apartment.price,
    latitude: like.apartment.latitude,
    longitude: like.apartment.longitude,
    country: like.apartment.country,
    subDivition: like.apartment.subDivition,
    status: like.apartment.status,
    stories: like.apartment.stories,
    yearBuilt: like.apartment.yearBuilt,
    propertyType: like.apartment.propertyType,
    MLS: like.apartment.MLS,
    maintenanceFee: like.apartment.maintenanceFee,
  }));

  return likedCourses;
};

export const LikeService = {
  toggleLike,
  getAllMyLikeIds,
  unlike,
};
