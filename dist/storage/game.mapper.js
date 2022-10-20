"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMapper = void 0;
const Field_1 = require("../domain/Field");
const Game_1 = require("../domain/Game");
class GameMapper {
    static mapToDomainGame(game) {
        return new Game_1.Game(game.status, [...game.players], game.currentPlayerMoveIndex, new Field_1.Field(game.field));
    }
}
exports.GameMapper = GameMapper;
