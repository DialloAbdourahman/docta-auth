import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword,
  IsMongoId,
  IsOptional,
  IsNumber,
  Min,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
} from "class-validator";
import { Type } from "class-transformer";
import { EducationInputDto } from "./education";
import { PositionInputDto } from "./position";
import { LanguageInputDto } from "./language";
import { FaqInputDto } from "./faq";
import { LocationInputDto } from "./location";

export class CreateDoctorDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsMongoId()
  specialtyId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  biography?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;
}

export class ActivateDoctorAccountDto {
  @IsString()
  @IsNotEmpty({ message: "Activation token token is required" })
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword()
  password: string;
}

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  biography?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  // Replace-all educations array
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationInputDto)
  educations?: EducationInputDto[];

  // Replace-all positions array
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionInputDto)
  positions?: PositionInputDto[];

  // Replace-all languages array
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageInputDto)
  languages?: LanguageInputDto[];

  // Replace-all FAQs array
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqInputDto)
  faqs?: FaqInputDto[];

  // Replace-all expertises array (array of strings)
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: "A maximum of 5 expertises is allowed" })
  @IsString({ each: true })
  expertises?: string[];

  // Optional location object (replace-all when provided)
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationInputDto)
  location?: LocationInputDto;
}
