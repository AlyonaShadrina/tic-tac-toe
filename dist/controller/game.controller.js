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
const express_validator_1 = require("express-validator");
const ActionResult_1 = require("../domain/ActionResult");
const verifyIdToken_1 = require("../verifyIdToken");
class GameController {
    constructor(_gameService, _app, _io) {
        this._gameService = _gameService;
        this._app = _app;
        this._io = _io;
        this._app.use(express_1.default.json());
        this._app.use(this.setHeaders);
        this._app.use(this.authenticate);
        this._app.post('/api/games', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loadGameResult = yield this.createGame([]);
            if (!ActionResult_1.ActionResult.isSuccess(loadGameResult)) {
                res.status(400);
                res.json(loadGameResult.info);
            }
            else {
                res.status(200);
                res.json(loadGameResult.info.data);
            }
        }));
        this._app.get('/api/games/:gameId', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        this._app.post('/api/games/:gameId/start', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const startGameResult = yield this.startGame(req.params.gameId);
            if (!ActionResult_1.ActionResult.isSuccess(startGameResult)) {
                res.status(400);
                res.json(startGameResult.info);
            }
            else {
                res.status(200);
                res.json(startGameResult.info.data);
                this._io.emit(`${req.params.gameId}_start`);
            }
        }));
        this._app.post('/api/games/:gameId/players', (0, express_validator_1.body)('symbol', 'Symbol is required').isString().not().isEmpty(), this.validateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const addPlayerResult = yield this.addPlayer((_a = req.params) === null || _a === void 0 ? void 0 : _a.gameId, req.body.authenticatedUserId, req.body.symbol);
            if (!ActionResult_1.ActionResult.isSuccess(addPlayerResult)) {
                res.status(400);
                res.json(addPlayerResult.info);
            }
            else {
                res.status(200);
                res.json(addPlayerResult.info.data);
                this._io.emit(`${req.params.gameId}_player`, addPlayerResult.info.data);
            }
        }));
        this._app.post('/api/games/:gameId/move', (0, express_validator_1.checkSchema)({
            coordinates: {
                custom: {
                    options: (coordinates) => {
                        if (Array.isArray(coordinates) && coordinates.length === 2) {
                            const [x, y] = coordinates;
                            return Number.isInteger(x) && Number.isInteger(y);
                        }
                        return false;
                    },
                    errorMessage: 'Wrong coordinates',
                },
            },
        }), this.validateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            const makeMoveResult = yield this.makeMove((_b = req.params) === null || _b === void 0 ? void 0 : _b.gameId, req.body.authenticatedUserId, req.body.coordinates);
            // TODO: why?
            // @ts-ignore
            if (!ActionResult_1.ActionResult.isSuccess(makeMoveResult)) {
                res.status(400);
                res.json(makeMoveResult.info);
            }
            else {
                res.status(200);
                res.json(makeMoveResult.info.data);
                this._io.emit(`${(_c = req.params) === null || _c === void 0 ? void 0 : _c.gameId}_move`, makeMoveResult.info.data);
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
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: should it really work that way?
            if (req.method !== 'OPTIONS') {
                if (req.headers.authorization) {
                    try {
                        const userId = yield (0, verifyIdToken_1.verify)(req.headers.authorization);
                        if (userId) {
                            req.body.authenticatedUserId = userId;
                            next();
                        }
                    }
                    catch (e) {
                        console.log('auth error');
                        res.status(401);
                        res.end();
                    }
                }
                else {
                    res.status(401);
                    res.end();
                }
            }
            else {
                next();
            }
        });
    }
    setHeaders(req, res, next) {
        // TODO: research on privacy
        res.setHeader('Access-Control-Allow-Origin', process.env.HEADER_CORS_ALLOWED || '');
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader('Content-Type', 'application/json');
        next();
    }
    validateRequest(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const formattedError = errors.formatWith(({ msg }) => msg);
            return res.status(400).json({ data: formattedError.mapped(), message: formattedError.array().join('. ') });
        }
        next();
    }
}
exports.GameController = GameController;
