import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateStartupDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name!: string;

  @IsString({ message: 'Le secteur doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le secteur est requis' })
  sector!: string;

  @IsString({ message: 'Le pays doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le pays est requis' })
  country!: string;

  @IsString({ message: 'La taille doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'La taille est requise' })
  size!: string;

  @IsString({ message: 'Le résumé doit être une chaîne de caractères' })
  @IsOptional()
  summary?: string;

  @IsInt({ message: 'Le score doit être un entier' })
  @Min(1, { message: 'Le score minimum est 1' })
  @Max(10, { message: 'Le score maximum est 10' })
  @IsOptional()
  score?: number;
}
