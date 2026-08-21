import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { AddWatchlistDto } from './dto/add-watchlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Watchlist')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer la watchlist cloud de l\'analyste connecté' })
  @ApiResponse({ status: 200, description: 'Liste des startups dans la watchlist' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findAll(@Req() req: any) {
    return this.watchlistService.findAllForUser(req.user.id);
  }

  @Post(':startupId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter une startup à sa watchlist cloud' })
  @ApiParam({ name: 'startupId', description: 'ID de la startup à épingler' })
  @ApiResponse({ status: 201, description: 'Startup ajoutée à la watchlist' })
  @ApiResponse({ status: 404, description: 'Startup introuvable' })
  add(
    @Req() req: any,
    @Param('startupId') startupId: string,
    @Body() dto: AddWatchlistDto,
  ) {
    return this.watchlistService.add(req.user.id, startupId, dto?.notes);
  }

  @Delete(':startupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retirer une startup de sa watchlist cloud' })
  @ApiParam({ name: 'startupId', description: 'ID de la startup à retirer' })
  @ApiResponse({ status: 200, description: 'Startup retirée de la watchlist' })
  remove(@Req() req: any, @Param('startupId') startupId: string) {
    return this.watchlistService.remove(req.user.id, startupId);
  }

  @Get('check/:startupId')
  @ApiOperation({ summary: 'Vérifier si une startup est dans la watchlist de l\'utilisateur' })
  @ApiParam({ name: 'startupId', description: 'ID de la startup à vérifier' })
  @ApiResponse({ status: 200, description: 'Statut de mise en watchlist' })
  check(@Req() req: any, @Param('startupId') startupId: string) {
    return this.watchlistService.isWatchlisted(req.user.id, startupId);
  }
}
