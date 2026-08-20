import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
  ApiParam,
} from '@nestjs/swagger';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { FindStartupsQueryDto } from './dto/find-startups-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Startups')
@Controller('startups')
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Récupérer les métriques consolidées du tableau de bord' })
  @ApiResponse({ status: 200, description: 'Statistiques agrégées (total, levées, fort potentiel, score moyen)' })
  getMetrics() {
    return this.startupsService.getMetrics();
  }

  @Get()
  @ApiOperation({ summary: 'Rechercher et filtrer les startups avec pagination' })
  @ApiResponse({ status: 200, description: 'Liste paginée des startups avec tours de table' })
  findAll(@Query() query: FindStartupsQueryDto) {
    return this.startupsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails complets d\'une startup par son ID' })
  @ApiParam({ name: 'id', description: 'Identifiant unique de la startup' })
  @ApiResponse({ status: 200, description: 'Fiche détaillée de la startup' })
  @ApiResponse({ status: 404, description: 'Startup non trouvée' })
  findOne(@Param('id') id: string) {
    return this.startupsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une nouvelle startup (Authentification requise)' })
  @ApiResponse({ status: 201, description: 'Startup créée avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé (Token JWT manquant ou invalide)' })
  create(@Body() createStartupDto: CreateStartupDto) {
    return this.startupsService.create(createStartupDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une startup (Authentification requise)' })
  @ApiParam({ name: 'id', description: 'Identifiant unique de la startup' })
  @ApiResponse({ status: 200, description: 'Startup mise à jour' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Startup non trouvée' })
  update(
    @Param('id') id: string,
    @Body() updateStartupDto: UpdateStartupDto,
  ) {
    return this.startupsService.update(id, updateStartupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer définitivement une startup (Authentification requise)' })
  @ApiParam({ name: 'id', description: 'Identifiant unique de la startup' })
  @ApiResponse({ status: 204, description: 'Startup supprimée avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Startup non trouvée' })
  remove(@Param('id') id: string) {
    return this.startupsService.remove(id);
  }
}
