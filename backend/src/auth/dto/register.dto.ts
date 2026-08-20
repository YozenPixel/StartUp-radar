import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'analyste@fonds-vc.com', description: 'Adresse email unique' })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email!: string;

  @ApiProperty({ example: 'motdepasse123', description: 'Mot de passe (minimum 6 caractères)' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit comporter au moins 6 caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password!: string;

  @ApiPropertyOptional({ example: 'Alexandre Dupont', description: 'Nom complet de l\'utilisateur' })
  @IsString()
  @IsOptional()
  name?: string;
}
