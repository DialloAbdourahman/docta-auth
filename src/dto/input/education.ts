import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class EducationInputDto {
  @IsNumber({}, { message: "Year must be a number" })
  @Min(0, { message: "Year must be greater than or equal to 0" })
  year!: number;

  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title!: string;
}
