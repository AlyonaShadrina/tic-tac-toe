"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDBEntity = void 0;
;
;
class GameDBEntity {
    constructor(currentPlayerMoveIndex, players, field, status, id) {
        this.currentPlayerMoveIndex = currentPlayerMoveIndex;
        this.players = players;
        this.field = field;
        this.status = status;
        this.id = id;
    }
}
exports.GameDBEntity = GameDBEntity;
