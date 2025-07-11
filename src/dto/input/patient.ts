import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from "class-validator";

export class CreatePatientDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword()
  password: string;
}
