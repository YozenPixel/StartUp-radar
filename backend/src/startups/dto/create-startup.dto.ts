import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStartupDto {
  @ApiProperty({ example: 'Mistral Foundry', description: 'Nom de la startup' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name!: string;

  @ApiProperty({ example: 'Artificial Intelligence', description: 'Secteur d\'activité' })
  @IsString({ message: 'Le secteur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le secteur est requis' })
  sector!: string;

  @ApiProperty({ example: 'France', description: 'Pays du siège social' })
  @IsString({ message: 'Le pays doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le pays est requis' })
  country!: string;

  @ApiProperty({ example: '51-200', description: 'Taille de l\'équipe' })
  @IsString({ message: 'La taille doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'La taille est requise' })
  size!: string;

  @ApiPropertyOptional({
    example: 'Développement de modèles de fondation souverains pour entreprises.',
    description: 'Résumé exécutif et proposition de valeur',
  })
  @IsString({ message: 'Le résumé doit être une chaîne de caractères' })
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ example: 9, description: 'Score d\'opportunité IA (1-10)' })
  @IsInt({ message: 'Le score doit être un entier' })
  @Min(1, { message: 'Le score minimum est 1' })
  @Max(10, { message: 'Le score maximum est 10' })
  @IsOptional()
  score?: number;
}
