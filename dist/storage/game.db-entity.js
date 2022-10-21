"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDBEntity = void 0;
const Field_1 = require("../domain/Field");
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
    static createDefaultGame({ currentPlayerMoveIndex = 0, players = [], field = Field_1.Field.createEmptyField().cells, status = 'created', }) {
        return new GameDBEntity(currentPlayerMoveIndex, players, field, status);
    }
}
exports.GameDBEntity = GameDBEntity;
