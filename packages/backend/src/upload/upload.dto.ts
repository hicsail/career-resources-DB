import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UploadDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  format: string;

  @IsNotEmpty()
  @IsString()
  source: string;

  // state can be empty or omitted
  @IsOptional()
  @IsString()
  state?: string;

  // country can be empty or omitted
  @IsOptional()
  @IsString()
  country?: string;
}