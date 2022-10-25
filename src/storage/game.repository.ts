import { ObjectId } from "mongodb";
import { TMakeMoveUpdates } from "../domain/Game";
import { TId } from "../types";
import { GameDBEntity, IPlayerDBEntity } from "./game.db-entity";
import GameModel from "./game.model";

export interface IGameRepository {
  find(gameId: TId): Promise<GameDBEntity | null>;
  update(gameId: TId, gameUpdates: TMakeMoveUpdates): Promise<void>;
  addPlayer(gameId: TId, player: IPlayerDBEntity): Promise<void>;
  create(game: GameDBEntity): Promise<GameDBEntity>;
  startGame(gameId: TId): Promise<void>;
}

export class GameRepository implements IGameRepository {
  constructor(
    private readonly _gameModel: typeof GameModel,
  ) {}
  async find(gameId: TId): Promise<GameDBEntity | null> {
    try {
      const result = await this._gameModel.findOne({ _id: new ObjectId(gameId) });
      // TODO: .toObject() or .lean()?
      return result ? result.toObject({ getters: true }) : result
    } catch (e) {
      return null;
    } 
  }

  async update(gameId: TId, gameUpdates: TMakeMoveUpdates) {
    await this._gameModel.findOneAndUpdate(
      { _id: gameId }, 
      { 
        status: gameUpdates.status,
        currentPlayerMoveIndex: gameUpdates.currentPlayerMoveIndex,
        [`field.[${gameUpdates.fieldCell.coordinates}]`]: gameUpdates.fieldCell.symbol, 
      }
    );
  }

  async addPlayer(gameId: TId, player: IPlayerDBEntity) {
    // TODO: check what happens if fails
    await this._gameModel.findOneAndUpdate(
      { _id: gameId }, 
      { $push: 
        { players: 
          { userId: player.userId, symbol: player.symbol }
        }
      }
    );
  }

  async create(game: GameDBEntity): Promise<GameDBEntity> {
    const newGame = await new this._gameModel(game).save();
    return newGame.toObject({ getters: true })
  }
  
  async startGame(gameId: TId) {
    // TODO: check what happens if fails
    await this._gameModel.findOneAndUpdate(
      { _id: gameId }, 
      { status: 'in_progress' },
    );
  }
}