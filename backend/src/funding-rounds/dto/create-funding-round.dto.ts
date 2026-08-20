import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundingRoundDto {
  @ApiProperty({ example: 'uuid-startup-id', description: 'Identifiant unique de la startup' })
  @IsString({ message: "L'identifiant de la startup est requis" })
  @IsNotEmpty()
  startupId!: string;

  @ApiProperty({ example: 105000000, description: 'Montant du tour de table en euros' })
  @IsNumber({}, { message: 'Le montant doit être un nombre positif' })
  @IsPositive({ message: 'Le montant doit être supérieur à 0' })
  amount!: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z', description: 'Date de la levée de fonds' })
  @IsDateString({}, { message: 'La date doit être au format ISO (ex: 2026-06-15T00:00:00.000Z)' })
  date!: string;
}
