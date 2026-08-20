import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'analyste@fonds-vc.com', description: 'Adresse email du compte' })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email!: string;

  @ApiProperty({ example: 'motdepasse123', description: 'Mot de passe du compte' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password!: string;
}
