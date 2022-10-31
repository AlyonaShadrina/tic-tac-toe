import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GameService } from './game.service';
import { AddPlayerDto } from './dto/add-player.dto';
import { MakeMoveDto } from './dto/make-move.dto';
import { ActionResult } from 'src/domain/ActionResult';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthInterceptor } from 'src/auth/auth.interceptor';

@Controller('api/games')
@UseGuards(AuthGuard)
export class GameController {
  // TODO: interface
  constructor(private readonly _gameService: GameService) {}

  @Post()
  async create() {
    const createGameResult = await this._gameService.createGame([]);
    return createGameResult.info.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const loadGameResult = await this._gameService.loadGame(id);
    if (!ActionResult.isSuccess(loadGameResult)) {
      throw new NotFoundException(loadGameResult.info);
    } else {
      return loadGameResult.info.data;
    }
  }

  @UseInterceptors(AuthInterceptor)
  @Post(':id/players')
  async addPlayer(@Param('id') id: string, @Body() addPlayerDto: AddPlayerDto) {
    const authenticatedUserId = await addPlayerDto.authenticatedUserId;
    const addPlayerResult = await this._gameService.addPlayer({
      gameId: id,
      userId: authenticatedUserId,
      symbol: addPlayerDto.symbol,
    });
    if (!ActionResult.isSuccess(addPlayerResult)) {
      throw new BadRequestException(addPlayerResult.info);
    } else {
      return addPlayerResult.info.data;
      // TODO: emit player data to others
    }
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    const startGameResult = await this._gameService.startGame(id);
    if (!ActionResult.isSuccess(startGameResult)) {
      throw new NotFoundException(startGameResult.info);
    } else {
      return startGameResult.info.data;
    }
  }

  @UseInterceptors(AuthInterceptor)
  @Post(':id/move')
  async makeMove(@Param('id') id: string, @Body() makeMoveDto: MakeMoveDto) {
    const authenticatedUserId = await makeMoveDto.authenticatedUserId;
    const makeMoveResult = await this._gameService.makeMove({
      gameId: id,
      userId: authenticatedUserId,
      coordinates: makeMoveDto.coordinates,
    });
    if (!ActionResult.isSuccess(makeMoveResult)) {
      throw new BadRequestException(makeMoveResult.info);
    } else {
      return makeMoveResult.info.data;
      // TODO: emit move data to others
    }
  }
}
