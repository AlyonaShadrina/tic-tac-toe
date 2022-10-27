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
const game_db_entity_1 = require("../storage/game.db-entity");
const game_mapper_1 = require("../storage/game.mapper");
class GameService {
    constructor(_gameRepository) {
        this._gameRepository = _gameRepository;
    }
    loadGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            if (!game) {
                return new ActionResult_1.ActionResultError('No game with provided id found', game);
            }
            return new ActionResult_1.ActionResultSuccess('', game);
        });
    }
    makeMove({ gameId, userId, coordinates }) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            if (!game) {
                return new ActionResult_1.ActionResultError('No game with provided id found', null);
            }
            const player = game.players.find(player => player.userId === userId);
            const domainGame = game_mapper_1.GameMapper.mapToDomainGame(game);
            const moveResult = domainGame.makeMove(coordinates, player === null || player === void 0 ? void 0 : player.symbol);
            if (ActionResult_1.ActionResult.isSuccess(moveResult)) {
                yield this._gameRepository.update(gameId, moveResult.info.data);
            }
            return moveResult;
        });
    }
    addPlayer({ gameId, userId, symbol }) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            if (!game) {
                return new ActionResult_1.ActionResultError('No game with provided id found', null);
            }
            if (game.players.find(player => player.userId === userId)) {
                return new ActionResult_1.ActionResultError('Player already registered in game', null);
            }
            const domainGame = game_mapper_1.GameMapper.mapToDomainGame(game);
            const addResult = domainGame.addPlayer({ symbol });
            if (ActionResult_1.ActionResult.isSuccess(addResult)) {
                yield this._gameRepository.addPlayer(gameId, { userId: userId, symbol });
                return new ActionResult_1.ActionResultSuccess(`Player with symbol "${symbol}" added`, { userId: userId, symbol, index: game.players.length });
            }
            return addResult;
        });
    }
    startGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.find(gameId);
            if (!game) {
                return new ActionResult_1.ActionResultError('No game with provided id found', null);
            }
            const domainGame = game_mapper_1.GameMapper.mapToDomainGame(game);
            const startResult = domainGame.startGame();
            if (ActionResult_1.ActionResult.isSuccess(startResult)) {
                yield this._gameRepository.startGame(gameId);
            }
            return startResult;
        });
    }
    createGame(players) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield this._gameRepository.create(game_db_entity_1.GameDBEntity.createDefaultGame({ players }));
            return new ActionResult_1.ActionResultSuccess('', game);
        });
    }
}
exports.GameService = GameService;
