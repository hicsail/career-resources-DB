import { IsNotEmpty, IsString } from 'class-validator';

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
}