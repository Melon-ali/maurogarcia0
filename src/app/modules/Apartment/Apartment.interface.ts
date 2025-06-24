export interface IApartment {
  id?: string;
  image?: string;
  title?: string;
  location?: string;
  description?: string;
  price?: number;
  balcony?: number;
  livingRoom?: number;
  diningRoom?: number;
  kitchen?: number;
  lockSystem?: "SMART";
  propertyType?: "APARTMENT";
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  buildYear?: number;
  yearBuilt?: number;
  status?: "AVAILABLE";
  latitude?: number;
  longitude?: number;
}

export type UpdatePropertyInput = Partial<IApartment>;

export enum ApartmentStatus {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
}

export enum PropertyType {
  APARTMENT = "APARTMENT",
  LEASE = "LEASE",
  COMMERCIAL = "COMMERCIAL",
  RESIDENTIAL = "RESIDENTIAL",
  CONOSTRUCTION = "CONOSTRUCTION",
  HOUSE = "HOUSE",
}

export enum lockSystem {
  SMART = "SMART",
  ANALOG = "ANALOG",
}

export type IApartmentFilterRequest = {
  title?: string | undefined;
  searchTerm?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
};
