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
const mongodb_1 = require("mongodb");
const data_1 = require("./data");
class GameRepository {
    constructor(_gameModel) {
        this._gameModel = _gameModel;
    }
    find(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._gameModel.findOne({ _id: new mongodb_1.ObjectId(gameId) });
            return result ? result.toObject({ getters: true }) : result;
        });
    }
    update(gameId, gameUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._gameModel.findOneAndUpdate({ _id: gameId }, {
                status: gameUpdates.status,
                currentPlayerMoveIndex: gameUpdates.currentPlayerMoveIndex,
                [`field.[${gameUpdates.fieldCell.coordinates}]`]: gameUpdates.fieldCell.symbol,
            });
        });
    }
    addPlayer(gameId, player) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: check what happens if fails
            yield this._gameModel.findOneAndUpdate({ _id: gameId }, { $push: { players: { userId: player.userId, symbol: player.symbol }
                }
            });
        });
    }
    create(game) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_1.games.push(Object.assign(Object.assign({}, game), { id: (data_1.games.length + 1).toString() }));
        });
    }
    startGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: check what happens if fails
            yield this._gameModel.findOneAndUpdate({ _id: gameId }, { status: 'in_progress' });
        });
    }
    delete() {
    }
}
exports.GameRepository = GameRepository;
