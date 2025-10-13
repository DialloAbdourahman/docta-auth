import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EnumLanguageLevel } from "../../enums/language-levels";

export class LanguageInputDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsEnum(EnumLanguageLevel, { message: "Level must be a valid language level" })
  level!: EnumLanguageLevel;
}
