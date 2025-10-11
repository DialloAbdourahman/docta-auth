import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class LocalizedSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class CreateSpecialtyDto {
  @ValidateNested()
  @Type(() => LocalizedSpecialtyDto)
  en!: LocalizedSpecialtyDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedSpecialtyDto)
  fr?: LocalizedSpecialtyDto;
}

export class UpdateSpecialtyDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedSpecialtyDto)
  en?: LocalizedSpecialtyDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedSpecialtyDto)
  fr?: LocalizedSpecialtyDto;
}
