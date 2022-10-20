"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const ActionResult_1 = require("./ActionResult");
class Game {
    constructor(status, players, currentPlayerMoveIndex, field) {
        this.status = status;
        this.players = players;
        this.currentPlayerMoveIndex = currentPlayerMoveIndex;
        this.field = field;
    }
    addPlayer(player) {
        if (this.status !== 'created') {
            return new ActionResult_1.ActionResultError('Game already started', null);
        }
        if (this.isSymbolRegistered(player.symbol)) {
            return new ActionResult_1.ActionResultError('Symbol is already taken', null);
        }
        this.players.push(player);
        return new ActionResult_1.ActionResultSuccess('Player have been added to game', null);
    }
    startGame() {
        if (this.status === 'finished') {
            return new ActionResult_1.ActionResultError('Game already finished', null);
        }
        if (!this.players.length) {
            return new ActionResult_1.ActionResultError('No users', null);
        }
        this.status = 'in_progress';
        return new ActionResult_1.ActionResultSuccess('Game started', null);
    }
    makeMove(coordinates, symbol) {
        if (this.status !== 'in_progress') {
            return new ActionResult_1.ActionResultError('Game not in progress', null);
        }
        if (!this.isSymbolRegistered(symbol)) {
            return new ActionResult_1.ActionResultError('Symbol is not registered in this game', null);
        }
        if (!this.isSymbolTurn(symbol)) {
            return new ActionResult_1.ActionResultError("It's not your turn to make a move", null);
        }
        const setCellContentResult = this.field.setCellContent(coordinates, symbol);
        if (!ActionResult_1.ActionResult.isSuccess(setCellContentResult)) {
            return setCellContentResult;
        }
        if (this.field.hasNSymbolsInRow(coordinates, symbol, 3)) {
            this.status = 'finished';
            return new ActionResult_1.ActionResultSuccess('Move made, game won', {
                fieldCell: { coordinates, symbol },
                status: this.status,
                currentPlayerMoveIndex: this.currentPlayerMoveIndex,
            });
        }
        this.currentPlayerMoveIndex = this.currentPlayerMoveIndex === this.players.length - 1 ? 0 : this.currentPlayerMoveIndex + 1;
        return new ActionResult_1.ActionResultSuccess('Move made', {
            fieldCell: { coordinates, symbol },
            status: this.status,
            currentPlayerMoveIndex: this.currentPlayerMoveIndex,
        });
    }
    isSymbolTurn(symbol) {
        return this.players[this.currentPlayerMoveIndex].symbol === symbol;
    }
    isSymbolRegistered(symbol) {
        return this.players.find(exitingPlayer => exitingPlayer.symbol === symbol);
    }
}
exports.Game = Game;
