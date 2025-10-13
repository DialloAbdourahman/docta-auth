import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class PositionInputDto {
  @IsNumber({}, { message: "Start date must be a number (timestamp in ms)" })
  @Min(0, { message: "Start date must be >= 0" })
  startDate!: number;

  @IsOptional()
  @IsNumber({}, { message: "End date must be a number (timestamp in ms)" })
  @Min(0, { message: "End date must be >= 0" })
  endDate?: number;

  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString({ message: "Company must be a string" })
  @IsNotEmpty({ message: "Company is required" })
  company!: string;
}

