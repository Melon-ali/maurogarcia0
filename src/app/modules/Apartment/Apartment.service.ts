import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import {
  ApartmentStatus,
  IApartment,
  IApartmentFilterRequest,
  PropertyType,
  UpdatePropertyInput,
} from "./Apartment.interface";
import { apartmentSearchableFields } from "./Apartment.constant";
import haversineDistance from "../../../shared/haversineDistance";

const createIntoDb = async (apartmentData?: IApartment) => {
  const { id, ...rest } = apartmentData || {};

  const result = await prisma.apartment.create({
    data: {
      image: rest.image ?? "",
      title: rest.title ?? "",
      location: rest.location ?? "",
      description: rest.description ?? "",
      price: rest.price ?? 0,
      balcony: rest.balcony ?? 0,
      livingRoom: rest.livingRoom ?? 0,
      diningRoom: rest.diningRoom ?? 0,
      kitchen: rest.kitchen ?? 0,
      lockSystem: rest.lockSystem ?? "SMART",
      propertyType: rest.propertyType ?? "APARTMENT",
      sqft: rest.sqft ?? 0,
      bedrooms: rest.bedrooms ?? 0,
      bathrooms: rest.bathrooms ?? 0,
      garage: rest.garage ?? 0,
      buildYear: rest.buildYear ?? 0,
      yearBuilt: rest.yearBuilt ?? 0,
      status: rest.status ?? "AVAILABLE",
      latitude: rest.latitude ?? 0,
      longitude: rest.longitude ?? 0,
    },
    select: {
      id: true,
      image: true,
      title: true,
      location: true,
      description: true,
      price: true,
      balcony: true,
      livingRoom: true,
      diningRoom: true,
      kitchen: true,
      lockSystem: true,
      propertyType: true,
      sqft: true,
      bedrooms: true,
      bathrooms: true,
      garage: true,
      buildYear: true,
      yearBuilt: true,
      status: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};


const getListFromDb = async (
  options: IPaginationOptions,
  params: IApartmentFilterRequest
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, longitude, latitude, ...filterData } = params;

  const andCondions: Prisma.ApartmentWhereInput[] = [];

  if (searchTerm) {
    andCondions.push({
      OR: apartmentSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.ApartmentWhereInput = {
    AND: [...andCondions],
  };

  const hasGeo =
    latitude !== undefined &&
    longitude !== undefined &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude));

  if (hasGeo) {
    const userLat = Number(latitude);
    const userLon = Number(longitude);

    // First get all apartments that match other filters
    const allApartments = await prisma.apartment.findMany({
      where: whereConditons,
    });

    // Calculate distance for each apartment
    type ApartmentWithDistance = (typeof allApartments)[number] & {
      distance: number;
    };

    let apartments: ApartmentWithDistance[] = allApartments.map((apt) => {
      const distance = haversineDistance(
        userLat,
        userLon,
        apt.latitude,
        apt.longitude
      );
      return { ...apt, distance };
    });

    // Sort by distance
    apartments = apartments.sort((a, b) => a.distance - b.distance);

    // Apply pagination
    const paginated = apartments.slice(skip, skip + limit);

    return {
      meta: {
        page,
        limit,
        total: apartments.length,
        totalPages: Math.ceil(apartments.length / limit),
      },
      data: paginated,
    };
  }

  // No geo filtering - use normal Prisma pagination
  const [apartments, total] = await Promise.all([
    prisma.apartment.findMany({
      where: whereConditons,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: "desc" },
    }),
    prisma.apartment.count({
      where: whereConditons,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: apartments,
  };
};


const getDashboardCount = async () => {
  const totalApartmentCount = await prisma.apartment.count({});

  const totalAgentCount = await prisma.user.count({
    where: {
      role: "AGENT",
    },
  });

  const totalUserCount = await prisma.user.count({
    where: {
      role: "USER",
    },
  });

  return {
    totalApartmentCount,
    totalAgentCount,
    totalUserCount,
  };
};

const blockApartment = async (id: string, status: any) => {
  const apartment = await prisma.apartment.findUnique({ where: { id } });
  if (!apartment) {
    throw new Error("apartment not found");
  }
  const result = await prisma.apartment.update({
    where: { id: apartment.id },
    data: {
     status,
    },
  });
  return result;
}

const getByIdFromDb = async (id: string) => {
  const result = await prisma.apartment.findUnique({ where: { id } });
  if (!result) {
    throw new Error("apartment not found");
  }
  return result;
};

const updateIntoDb = async (
  id: string,
  fileUrl: string | undefined,
  propertyData: UpdatePropertyInput
) => {
  const result = await prisma.apartment.update({
    where: { id },
    data: {
      ...propertyData,
      ...(fileUrl && { image: fileUrl }), // Only set image if fileUrl exists
    },
  });
  return result;
};


const deleteItemFromDb = async (id: string) => {
  const deletedItem = await prisma.apartment.delete({
    where: { id },
  });

  // Add any additional logic if necessary, e.g., cascading deletes
  return deletedItem;
};
export const ApartmentService = {
  createIntoDb,
  getListFromDb,
  getDashboardCount,
  blockApartment,
  getByIdFromDb,
  updateIntoDb,
  deleteItemFromDb,
};
