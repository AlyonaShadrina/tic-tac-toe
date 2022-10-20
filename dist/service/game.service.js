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
exports.GameService = void 0;
const ActionResult_1 = require("../domain/ActionResult");
const game_mapper_1 = require("../storage/game.mapper");
class GameService {
    constructor(_gameRepository) {
        this._gameRepository = _gameRepository;
    }
    loadGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._gameRepository.find(gameId);
        });
    }
    makeMove({ gameId, userId, coordinates }) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            const player = game.players.find(player => player.id === userId);
            // TODO: inject GameMapper? 
            const domainGame = game_mapper_1.GameMapper.mapToDomainGame(game);
            const moveResult = domainGame.makeMove(coordinates, player === null || player === void 0 ? void 0 : player.symbol);
            // TODO: why?
            // @ts-ignore
            if (ActionResult_1.ActionResult.isSuccess(moveResult)) {
                yield this._gameRepository.update(gameId, moveResult.info.data);
            }
            return moveResult;
        });
    }
    addPlayer({ gameId, userId, symbol }) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            if (game.players.find(player => player.id === userId)) {
                return new ActionResult_1.ActionResultError('Player already registered in game', null);
            }
            // TODO: inject GameMapper? 
            const domainGame = game_mapper_1.GameMapper.mapToDomainGame(game);
            const addResult = domainGame.addPlayer({ symbol });
            if (ActionResult_1.ActionResult.isSuccess(addResult)) {
                yield this._gameRepository.addPlayer(gameId, { id: userId, symbol });
            }
            return addResult;
        });
    }
    startGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            // TODO: inject GameMapper? 
            const domainGame = game_mapper_1.GameMapper.mapToDomainGame(game);
            const startResult = domainGame.startGame();
            if (ActionResult_1.ActionResult.isSuccess(startResult)) {
                yield this._gameRepository.startGame(gameId);
            }
            return startResult;
        });
    }
}
exports.GameService = GameService;
