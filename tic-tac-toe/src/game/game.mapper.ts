import { Field } from 'src/domain/Field';
import { Game } from 'src/domain/Game';
import { GameDBEntity } from './entities/game.entity';

export class GameMapper {
  static mapToDomainGame(game: GameDBEntity) {
    return new Game(
      game.status,
      [...game.players],
      game.currentPlayerMoveIndex,
      new Field(game.field),
    );
  }
}
