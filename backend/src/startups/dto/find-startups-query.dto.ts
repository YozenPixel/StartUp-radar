import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindStartupsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Numéro de page', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Nombre d\'éléments par page', default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ example: 'Artificial Intelligence', description: 'Filtrer par secteur' })
  @IsString()
  @IsOptional()
  sector?: string;

  @ApiPropertyOptional({ example: 'France', description: 'Filtrer par pays' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 8, description: 'Score minimum (1-10)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  minScore?: number;

  @ApiPropertyOptional({ example: 'Mistral', description: 'Recherche textuelle multi-champs' })
  @IsString()
  @IsOptional()
  search?: string;
}
