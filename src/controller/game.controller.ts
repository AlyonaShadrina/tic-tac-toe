import { TCoordinates, TFieldSymbol } from "../domain/types";
import { IGameService } from "../service/game.service";
import { TId } from "../types";

export class GameController {
  constructor(
    private readonly _gameService: IGameService
  ) {}

  async loadGame(gameId: TId) {
    return this._gameService.loadGame(gameId);
  }

  async makeMove(gameId: TId, userId: TId, coordinates: TCoordinates) {
    return this._gameService.makeMove({ gameId, userId, coordinates });
  }

  async addPlayer(gameId: TId, userId: TId, symbol: TFieldSymbol) {
    return this._gameService.addPlayer({ gameId, userId, symbol });
  }

  async startGame(gameId: TId) {
    return this._gameService.startGame(gameId);
  }
}