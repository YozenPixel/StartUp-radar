import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateFundingRoundDto {
  @IsString({ message: "L'identifiant de la startup est requis" })
  @IsNotEmpty()
  startupId!: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre positif' })
  @IsPositive({ message: 'Le montant doit être supérieur à 0' })
  amount!: number;

  @IsDateString({}, { message: 'La date doit être au format ISO (ex: 2026-06-15T00:00:00.000Z)' })
  date!: string;
}
