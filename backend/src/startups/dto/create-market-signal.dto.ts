import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMarketSignalDto {
  @ApiProperty({
    example: 'HIRING_SURGE',
    description: 'Type de signal (HIRING_SURGE, TECH_INNOVATION, FUNDING_MOMENTUM, PRODUCT_LAUNCH)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le type de signal est requis' })
  type!: string;

  @ApiProperty({
    example: 'Hausse de 65% des offres d\'emploi en R&D IA sur les 60 derniers jours.',
    description: 'Description détaillée du signal capté',
  })
  @IsString()
  @IsNotEmpty({ message: 'La description du signal est requise' })
  description!: string;

  @ApiPropertyOptional({
    example: 0.92,
    description: 'Score de confiance de l\'algorithme ou de l\'analyste (0.0 à 1.0)',
    default: 0.8,
  })
  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  @IsOptional()
  confidenceScore?: number;
}
