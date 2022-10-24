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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const express_1 = __importDefault(require("express"));
const ActionResult_1 = require("../domain/ActionResult");
// TODO: userId should be taken from auth info, not from params
class GameController {
    constructor(_gameService, _server) {
        this._gameService = _gameService;
        this._server = _server;
        this._server.use(express_1.default.json());
        this._server.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', process.env.HEADER_CORS_ALLOWED || '');
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader('Content-Type', 'application/json');
            next();
        });
        this._server.post('/api/games', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loadGameResult = yield this.createGame(req.body);
            if (!ActionResult_1.ActionResult.isSuccess(loadGameResult)) {
                res.status(400);
                res.json(loadGameResult.info);
            }
            else {
                res.status(200);
                res.json(loadGameResult.info.data);
            }
        }));
        this._server.get('/api/games/:gameId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loadGameResult = yield this.loadGame(req.params.gameId);
            if (!ActionResult_1.ActionResult.isSuccess(loadGameResult)) {
                res.status(404);
                res.json(loadGameResult.info);
            }
            else {
                res.status(200);
                res.json(loadGameResult.info.data);
            }
        }));
        this._server.post('/api/games/:gameId/start', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const startGameResult = yield this.startGame(req.params.gameId);
            if (!ActionResult_1.ActionResult.isSuccess(startGameResult)) {
                res.status(400);
                res.json(startGameResult.info);
            }
            else {
                res.status(200);
                res.json(startGameResult.info.data);
            }
        }));
        this._server.post('/api/games/:gameId/players', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const addPlayerResult = yield this.addPlayer(req.params.gameId, req.body.userId, req.body.symbol);
            if (!ActionResult_1.ActionResult.isSuccess(addPlayerResult)) {
                res.status(400);
                res.json(addPlayerResult.info);
            }
            else {
                res.status(200);
                res.json(addPlayerResult.info.data);
            }
        }));
        this._server.post('/api/games/:gameId/move', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const addPlayerResult = yield this.makeMove(req.params.gameId, req.body.userId, req.body.coordinates);
            // TODO: why?
            // @ts-ignore
            if (!ActionResult_1.ActionResult.isSuccess(addPlayerResult)) {
                res.status(400);
                res.json(addPlayerResult.info);
            }
            else {
                res.status(200);
                res.json(addPlayerResult.info.data);
            }
        }));
        // this._server.on('request', async (req, res) => {
        //   // TODO: looks bad, should be rewritten
        //   const headers = {
        //     "Content-Type": "application/json",
        //     'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
        //   };     
        //   const isGamesUrl = req.url?.includes('/api/games'); 
        //   const gameId = req.url?.split('/')[3];
        //   const path = req.url?.split('/')[4];
        //   else if (req.method === "POST" && gameId && path === 'players') {
        //     // TODO: do not store it in variable, use stream pipes somehow
        //     const requestBody: any[] = [];
        //     req.on('data', (chunks) => { requestBody.push(chunks); });      
        //     req.on('end', async () => {
        //       const reqBody = Buffer.concat(requestBody).toString();
        //       const playerToAdd = JSON.parse(reqBody);
        //       if (playerToAdd) {
        //         const addPlayerResult = await this.addPlayer(gameId, playerToAdd.userId, playerToAdd.symbol);
        //         if (!ActionResult.isSuccess(addPlayerResult)) {
        //           res.writeHead(400, headers);
        //           return res.end(JSON.stringify(addPlayerResult.info));
        //         }
        //         res.writeHead(200, headers);
        //         return res.end(JSON.stringify(addPlayerResult.info.data));
        //       }
        //       res.writeHead(400, headers);
        //       return res.end(JSON.stringify('No player provided'));
        //     });
        //   }
        //   else if (req.method === "POST" && gameId && path === 'move') {
        //     // TODO: do not store it in variable, use stream pipes somehow
        //     const requestBody: any[] = [];
        //     req.on('data', (chunks) => { requestBody.push(chunks); });      
        //     req.on('end', async () => {
        //       const reqBody = Buffer.concat(requestBody).toString();
        //       const moveInfo = JSON.parse(reqBody);
        //       if (moveInfo) {
        //         const makeMoveResult = await this.makeMove(gameId, moveInfo.userId, moveInfo.coordinates);
        //         // TODO: why?
        //         // @ts-ignore
        //         if (!ActionResult.isSuccess(makeMoveResult)) {
        //           res.writeHead(400, headers);
        //           return res.end(JSON.stringify(makeMoveResult.info));
        //         }
        //         res.writeHead(200, headers);
        //         return res.end(JSON.stringify(makeMoveResult.info.data));
        //       }
        //       res.writeHead(400, headers);
        //       return res.end(JSON.stringify('No move info provided'));
        //     });
        //   }
        //   else {
        //     res.writeHead(404, headers);
        //     return res.end('no such enpoint');
        //   }
        // })    
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
