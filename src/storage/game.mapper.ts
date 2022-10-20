import { Field } from "../domain/Field";
import { Game } from "../domain/Game";
import { GameDBEntity } from "./game.db-entity";

export class GameMapper {
  static mapToDomainGame(
    game: GameDBEntity
  ) {
    return new Game(game.status, [...game.players], game.currentPlayerMoveIndex, new Field(game.field));
  }

  // static mapToDBGame(
  //   game: Game
  // ) {
  //   return new GameDBEntity(game.currentPlayerMoveIndex, game.players as any, game.field, game.status);
  // }
}