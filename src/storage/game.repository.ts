import { Game, TMakeMoveUpdates } from "../domain/Game";
import { TId } from "../types";
import { games } from "./data";
import { GameDBEntity, IPlayerDBEntity } from "./game.db-entity";

export interface IGameRepository {
  find(gameId: TId): Promise<GameDBEntity>;
  update(gameId: TId, gameUpdates: TMakeMoveUpdates): Promise<void>;
  addPlayer(gameId: TId, player: IPlayerDBEntity): Promise<void>;
  create(game: GameDBEntity): Promise<void>;
  startGame(gameId: TId): Promise<void>;
}

export class GameRepository implements IGameRepository {
  async find(gameId: TId): Promise<GameDBEntity> {
    return Promise.resolve(games.find(game => game.id === gameId) as GameDBEntity);
  }

  async update(gameId: TId, gameUpdates: TMakeMoveUpdates) {
    console.log('REPO: gameUpdates', gameUpdates);
    
    const gameToUpdate = await this.find(gameId);
    const { fieldCell } = gameUpdates;
    const newField = {
      ...gameToUpdate?.field,
      [JSON.stringify(fieldCell.coordinates)]: fieldCell.symbol,
    };
    const updatedGame: GameDBEntity = {
      ...gameToUpdate,
      field: newField,
      status: gameUpdates.status,
      currentPlayerMoveIndex: gameUpdates.currentPlayerMoveIndex,
    };
    // @ts-ignore
    // games = [...games.filter(game => game.id !== gameId), updatedGame]
    games.splice(games.findIndex((game) => game.id === gameId), 1, updatedGame)
    console.log('updatedGame', updatedGame);
    
  }

  async addPlayer(gameId: TId, player: IPlayerDBEntity) {
    const gameToUpdate = await this.find(gameId);
    console.log('REPO add player: ', player);
    
    await gameToUpdate?.players.push(player);
    console.log('----gameToUpdate?.players', gameToUpdate?.players);
    
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