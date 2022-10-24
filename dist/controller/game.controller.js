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
const ActionResult_1 = require("../domain/ActionResult");
class GameController {
    constructor(_gameService, _server) {
        this._gameService = _gameService;
        this._server = _server;
        this._server.on('request', (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // TODO: looks bad, should be rewritten
            const headers = {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
            };
            const isGamesUrl = (_a = req.url) === null || _a === void 0 ? void 0 : _a.includes('/api/games');
            const gameId = (_b = req.url) === null || _b === void 0 ? void 0 : _b.split('/')[3];
            const path = (_c = req.url) === null || _c === void 0 ? void 0 : _c.split('/')[4];
            if (req.method === "GET" && isGamesUrl) {
                if (!gameId) {
                    res.writeHead(404, headers);
                    return res.end('no game id provided');
                }
                const loadGameResult = yield this.loadGame(gameId);
                res.writeHead(200, headers);
                return res.end(JSON.stringify(loadGameResult.info.data));
            }
            else if (req.method === "POST" && gameId && path === 'start') {
                const startGameResult = yield this.startGame(gameId);
                if (!ActionResult_1.ActionResult.isSuccess(startGameResult)) {
                    res.writeHead(400, headers);
                    return res.end(JSON.stringify(startGameResult.info));
                }
                res.writeHead(200, headers);
                return res.end(JSON.stringify(startGameResult.info.data));
            }
            else if (req.method === "POST" && gameId && path === 'players') {
                // TODO: do not store it in variable, use stream pipes somehow
                const requestBody = [];
                req.on('data', (chunks) => { requestBody.push(chunks); });
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const reqBody = Buffer.concat(requestBody).toString();
                    const playerToAdd = JSON.parse(reqBody);
                    if (playerToAdd) {
                        const addPlayerResult = yield this.addPlayer(gameId, playerToAdd.userId, playerToAdd.symbol);
                        if (!ActionResult_1.ActionResult.isSuccess(addPlayerResult)) {
                            res.writeHead(400, headers);
                            return res.end(JSON.stringify(addPlayerResult.info));
                        }
                        res.writeHead(200, headers);
                        return res.end(JSON.stringify(addPlayerResult.info.data));
                    }
                    res.writeHead(400, headers);
                    return res.end(JSON.stringify('No player provided'));
                }));
            }
            else if (req.method === "POST" && gameId && path === 'move') {
                // TODO: do not store it in variable, use stream pipes somehow
                const requestBody = [];
                req.on('data', (chunks) => { requestBody.push(chunks); });
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const reqBody = Buffer.concat(requestBody).toString();
                    const moveInfo = JSON.parse(reqBody);
                    if (moveInfo) {
                        const makeMoveResult = yield this.makeMove(gameId, moveInfo.userId, moveInfo.coordinates);
                        // TODO: why?
                        // @ts-ignore
                        if (!ActionResult_1.ActionResult.isSuccess(makeMoveResult)) {
                            res.writeHead(400, headers);
                            return res.end(JSON.stringify(makeMoveResult.info));
                        }
                        res.writeHead(200, headers);
                        return res.end(JSON.stringify(makeMoveResult.info.data));
                    }
                    res.writeHead(400, headers);
                    return res.end(JSON.stringify('No move info provided'));
                }));
            }
            else if (req.method === "POST" && isGamesUrl) {
                // TODO: do not store it in variable, use stream pipes somehow
                const requestBody = [];
                req.on('data', (chunks) => { requestBody.push(chunks); });
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const reqBody = Buffer.concat(requestBody).toString();
                    const createGameResult = yield this.createGame(JSON.parse(reqBody) || []);
                    if (!ActionResult_1.ActionResult.isSuccess(createGameResult)) {
                        res.writeHead(400, headers);
                        return res.end(JSON.stringify(createGameResult.info.data));
                    }
                    res.writeHead(200, headers);
                    return res.end(JSON.stringify(createGameResult.info.data));
                }));
            }
            else {
                res.writeHead(404, headers);
                return res.end('no such enpoint');
            }
        }));
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
    createGame(players) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._gameService.createGame(players);
        });
    }
}
exports.GameController = GameController;
