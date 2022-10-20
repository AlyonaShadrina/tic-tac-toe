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
exports.GameController = void 0;
class GameController {
    constructor(_gameService) {
        this._gameService = _gameService;
    }
    loadGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._gameService.loadGame(gameId);
        });
    }
    makeMove(gameId, userId, coordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._gameService.makeMove({ gameId, userId, coordinates });
        });
    }
    addPlayer(gameId, userId, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._gameService.addPlayer({ gameId, userId, symbol });
        });
    }
    startGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._gameService.startGame(gameId);
        });
    }
}
exports.GameController = GameController;
