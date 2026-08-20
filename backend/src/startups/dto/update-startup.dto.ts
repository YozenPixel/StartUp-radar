import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateStartupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  score?: number;
}
