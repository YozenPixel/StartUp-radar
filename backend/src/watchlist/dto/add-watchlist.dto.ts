import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddWatchlistDto {
  @ApiPropertyOptional({ example: 'Cible prioritaire pour investissement Série A', description: 'Notes personnelles de l\'analyste' })
  @IsString()
  @IsOptional()
  notes?: string;
}
