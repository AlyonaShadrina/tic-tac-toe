import { Injectable } from '@nestjs/common';
import {
  ActionResult,
  ActionResultError,
  ActionResultSuccess,
} from 'src/domain/ActionResult';
import { Game } from 'src/domain/Game';
import { TCoordinates, TFieldSymbol } from 'src/domain/types';
import { TId } from 'src/types';
import { GameDBEntity, IPlayerDBEntity } from './entities/game.entity';
import { GameMapper } from './game.mapper';
import { GameRepository } from './game.repository';

type TMoveInfo = { gameId: TId; userId: TId; coordinates: TCoordinates };
type TAddPlayerInfo = { gameId: TId; userId: TId; symbol: TFieldSymbol };

export interface IGameService {
  loadGame(
    gameId: TId,
  ): Promise<ActionResultSuccess<GameDBEntity> | ActionResultError<null>>;
  startGame(gameId: TId): Promise<ReturnType<Game['startGame']>>;
  makeMove(move: TMoveInfo): Promise<ReturnType<Game['makeMove']>>;
  addPlayer(
    move: TAddPlayerInfo,
  ): Promise<
    | ReturnType<Game['addPlayer']>
    | ActionResultSuccess<IPlayerDBEntity & { index: number }>
  >;
  createGame(
    players: IPlayerDBEntity[],
  ): Promise<ActionResultSuccess<GameDBEntity>>;
}

@Injectable()
export class GameService implements IGameService {
  // TODO: should be an interface
  constructor(private readonly _gameRepository: GameRepository) {}

  async loadGame(gameId: TId) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError(
        'No game with provided id found',
        game as null,
      );
    }
    return new ActionResultSuccess('', game);
  }

  async makeMove({ gameId, userId, coordinates }: TMoveInfo) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', null);
    }
    const player = game.players.find(
      (player) => player.userId === userId,
    ) as IPlayerDBEntity;
    const domainGame = GameMapper.mapToDomainGame(game);
    const moveResult = domainGame.makeMove(coordinates, player?.symbol);

    if (ActionResult.isSuccess(moveResult)) {
      await this._gameRepository.update(gameId, moveResult.info.data);
    }

    return moveResult;
  }

  async addPlayer({ gameId, userId, symbol }: TAddPlayerInfo) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', null);
    }
    if (game.players.find((player) => player.userId === userId)) {
      return new ActionResultError('Player already registered in game', null);
    }
    const domainGame = GameMapper.mapToDomainGame(game);
    const addResult = domainGame.addPlayer({ symbol });

    if (ActionResult.isSuccess(addResult)) {
      await this._gameRepository.addPlayer(gameId, { userId: userId, symbol });
      return new ActionResultSuccess(`Player with symbol "${symbol}" added`, {
        userId: userId,
        symbol,
        index: game.players.length,
      });
    }

    return addResult;
  }
  async startGame(gameId: TId) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', null);
    }
    const domainGame = GameMapper.mapToDomainGame(game);
    const startResult = domainGame.startGame();

    if (ActionResult.isSuccess(startResult)) {
      await this._gameRepository.startGame(gameId);
    }

    return startResult;
  }

  async createGame(players: IPlayerDBEntity[]) {
    const game = await this._gameRepository.create(
      GameDBEntity.createDefaultGame({ players }),
    );
    return new ActionResultSuccess('', game);
  }
}
