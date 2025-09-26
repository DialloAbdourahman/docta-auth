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
} from "class-validator";

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
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword()
  password: string;
}
