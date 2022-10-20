"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRepository = void 0;
const data_1 = require("./data");
class GameRepository {
    find(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(data_1.games.find(game => game.id === gameId));
        });
    }
    update(gameId, gameUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('REPO: gameUpdates', gameUpdates);
            const gameToUpdate = yield this.find(gameId);
            const { fieldCell } = gameUpdates;
            const newField = Object.assign(Object.assign({}, gameToUpdate === null || gameToUpdate === void 0 ? void 0 : gameToUpdate.field), { [JSON.stringify(fieldCell.coordinates)]: fieldCell.symbol });
            const updatedGame = Object.assign(Object.assign({}, gameToUpdate), { field: newField, status: gameUpdates.status, currentPlayerMoveIndex: gameUpdates.currentPlayerMoveIndex });
            // @ts-ignore
            // games = [...games.filter(game => game.id !== gameId), updatedGame]
            data_1.games.splice(data_1.games.findIndex((game) => game.id === gameId), 1, updatedGame);
            console.log('updatedGame', updatedGame);
        });
    }
    addPlayer(gameId, player) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameToUpdate = yield this.find(gameId);
            console.log('REPO add player: ', player);
            yield (gameToUpdate === null || gameToUpdate === void 0 ? void 0 : gameToUpdate.players.push(player));
            console.log('----gameToUpdate?.players', gameToUpdate === null || gameToUpdate === void 0 ? void 0 : gameToUpdate.players);
        });
    }
    create(game) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_1.games.push(Object.assign(Object.assign({}, game), { id: (data_1.games.length + 1).toString() }));
        });
    }
    startGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gameToUpdate = yield this.find(gameId);
            gameToUpdate.status = 'in_progress';
        });
    }
    delete() {
    }
}
exports.GameRepository = GameRepository;
