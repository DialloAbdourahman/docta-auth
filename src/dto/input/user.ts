import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
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

export class LoginDto {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}

export class RefreshTokenDto {
  @IsString({ message: "Refresh token must be a string" })
  @IsNotEmpty({ message: "Refresh token is required" })
  refreshToken: string;
}

export class ActivateAccountDto {
  @IsString({ message: "Token must be a string" })
  @IsNotEmpty({ message: "Token is required" })
  token: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}

export class ResetPasswordDto {
  @IsString({ message: "Token must be a string" })
  @IsNotEmpty({ message: "Token is required" })
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsStrongPassword()
  newPassword: string;
}
