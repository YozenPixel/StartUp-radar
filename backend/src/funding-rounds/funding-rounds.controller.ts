import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FundingRoundsService } from './funding-rounds.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Funding Rounds')
@Controller('funding-rounds')
export class FundingRoundsController {
  constructor(private readonly fundingRoundsService: FundingRoundsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les tours de table (avec filtre optionnel par startup)' })
  @ApiQuery({ name: 'startupId', required: false, description: 'ID de la startup' })
  @ApiResponse({ status: 200, description: 'Liste des levées de fonds' })
  findAll(@Query('startupId') startupId?: string) {
    return this.fundingRoundsService.findAll(startupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'un tour de financement' })
  @ApiResponse({ status: 200, description: 'Détails du tour de financement' })
  @ApiResponse({ status: 404, description: 'Tour de table non trouvé' })
  findOne(@Param('id') id: string) {
    return this.fundingRoundsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer une nouvelle levée de fonds (Authentification requise)' })
  @ApiResponse({ status: 201, description: 'Levée de fonds enregistrée' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  create(@Body() createFundingRoundDto: CreateFundingRoundDto) {
    return this.fundingRoundsService.create(createFundingRoundDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un tour de table (Authentification requise)' })
  @ApiResponse({ status: 204, description: 'Tour de table supprimé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  remove(@Param('id') id: string) {
    return this.fundingRoundsService.remove(id);
  }
}
