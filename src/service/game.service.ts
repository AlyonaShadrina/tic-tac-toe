import { ActionResult, ActionResultError, ActionResultSuccess } from "../domain/ActionResult";
import { Game, TMakeMoveUpdates } from "../domain/Game";
import { TCoordinates, TFieldSymbol } from "../domain/types";
import { GameDBEntity, IPlayerDBEntity } from "../storage/game.db-entity";
import { GameMapper } from "../storage/game.mapper";
import { IGameRepository } from "../storage/game.repository";
import { TId } from "../types";

type TMoveInfo = { gameId: TId; userId: TId; coordinates: TCoordinates };
type TAddPlayerInfo = { gameId: TId; userId: TId; symbol: TFieldSymbol };

export interface IGameService {
  loadGame(gameId: TId): Promise<ActionResultSuccess<GameDBEntity> | ActionResultError<null>>;
  startGame(gameId: TId): Promise<ReturnType<Game['startGame']>>;
  makeMove(move: TMoveInfo): Promise<ReturnType<Game['makeMove']>>;
  addPlayer(move: TAddPlayerInfo): Promise<ReturnType<Game['addPlayer']>>;
}

export class GameService implements IGameService {
  constructor(
    private readonly _gameRepository: IGameRepository,
  ) {}

  async loadGame(gameId: TId) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', game);
    }
    return new ActionResultSuccess('', game)
  }

  async makeMove({ gameId, userId, coordinates }: TMoveInfo) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', null);
    }
    const player = game.players.find(player => player.userId === userId) as IPlayerDBEntity;
    // TODO: inject GameMapper? 
    const domainGame = GameMapper.mapToDomainGame(game);
    const moveResult = domainGame.makeMove(coordinates, player?.symbol);

    // TODO: why?
    // @ts-ignore
    if (ActionResult.isSuccess(moveResult)) {
      await this._gameRepository.update(gameId, moveResult.info.data as TMakeMoveUpdates);
    }

    return moveResult;
  }

  async addPlayer({ gameId, userId, symbol }: TAddPlayerInfo) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', null);
    }
    if (game.players.find(player => player.userId === userId)) {
      return new ActionResultError('Player already registered in game', null)
    }
    // TODO: inject GameMapper? 
    const domainGame = GameMapper.mapToDomainGame(game);
    const addResult = domainGame.addPlayer({ symbol });

    if (ActionResult.isSuccess(addResult)) {
      await this._gameRepository.addPlayer(gameId, { userId: userId, symbol });
    }

    return addResult;
  }
  async startGame(gameId: TId) {
    const game = await this._gameRepository.find(gameId);
    if (!game) {
      return new ActionResultError('No game with provided id found', null);
    }
    // TODO: inject GameMapper? 
    const domainGame = GameMapper.mapToDomainGame(game);
    const startResult = domainGame.startGame();

    if (ActionResult.isSuccess(startResult)) {
      await this._gameRepository.startGame(gameId);
    }

    return startResult;
  }
}