import { IsNumber, IsOptional, IsString } from "class-validator";

export class LocationInputDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string; // ISO code eg: fr

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @IsNumber()
  distanceInMeters?: number | null;
}
