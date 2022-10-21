import { ObjectId } from "mongodb";
import { TMakeMoveUpdates } from "../domain/Game";
import { TId } from "../types";
import { games } from "./data";
import { GameDBEntity, IPlayerDBEntity } from "./game.db-entity";
import GameModel from "./game.model";

export interface IGameRepository {
  find(gameId: TId): Promise<GameDBEntity | null>;
  update(gameId: TId, gameUpdates: TMakeMoveUpdates): Promise<void>;
  addPlayer(gameId: TId, player: IPlayerDBEntity): Promise<void>;
  create(game: GameDBEntity): Promise<void>;
  startGame(gameId: TId): Promise<void>;
}

export class GameRepository implements IGameRepository {
  constructor(
    private readonly _gameModel: typeof GameModel,
  ) {}
  async find(gameId: TId): Promise<GameDBEntity | null> {
    const result = await this._gameModel.findOne({ _id: new ObjectId(gameId) }).exec();
    return result ? result.toObject() : result
  }

  async update(gameId: TId, gameUpdates: TMakeMoveUpdates) {
    console.log('REPO: gameUpdates', gameUpdates);
    
    const gameToUpdate = await this.find(gameId);
    const { fieldCell } = gameUpdates;
    const newField = {
      ...gameToUpdate?.field,
      [JSON.stringify(fieldCell.coordinates)]: fieldCell.symbol,
    };
    // @ts-ignore
    const updatedGame: GameDBEntity = {
      ...gameToUpdate,
      field: newField,
      status: gameUpdates.status,
      currentPlayerMoveIndex: gameUpdates.currentPlayerMoveIndex,
    };
    games.splice(games.findIndex((game) => game.id === gameId), 1, updatedGame)
    console.log('updatedGame', updatedGame);
    
  }

  async addPlayer(gameId: TId, player: IPlayerDBEntity) {
    // TODO: check what happens if fails
    await this._gameModel.findOneAndUpdate(
      { _id: gameId }, 
      { $push: 
        { players: 
          { id: new ObjectId(player.id), symbol: player.symbol }
        }
      }
    );
  }

  async create(game: GameDBEntity) {
    await games.push({ ...game, id: (games.length + 1).toString() })
  }
  
  async startGame(gameId: TId) {
    const gameToUpdate = await this.find(gameId);
    (gameToUpdate as GameDBEntity).status = 'in_progress';
  }

  delete() {

  }
}