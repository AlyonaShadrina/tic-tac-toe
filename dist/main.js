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
const game_controller_1 = require("./controller/game.controller");
const game_service_1 = require("./service/game.service");
const game_repository_1 = require("./storage/game.repository");
class UI {
    constructor(gameId) {
        this.game = null;
        this.gameId = gameId;
    }
    loadGame() {
        return __awaiter(this, void 0, void 0, function* () {
            this.game = yield gameController.loadGame(this.gameId);
            this.printUI();
        });
    }
    makeMove(userId, coordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield gameController.makeMove(this.gameId, userId, coordinates);
            console.log('makeMove result', result);
            this.loadGame();
        });
    }
    addPlayer(userId, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield gameController.addPlayer(this.gameId, userId, symbol);
            console.log('addPlayer result', result);
            this.loadGame();
        });
    }
    startGame() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield gameController.startGame(this.gameId);
            console.log('startGame result', result);
            this.loadGame();
        });
    }
    printUI() {
        this.printField();
        this.printStatus();
    }
    printStatus() {
        var _a;
        console.log('game status: ', (_a = this.game) === null || _a === void 0 ? void 0 : _a.status);
    }
    printField() {
        if (!this.game) {
            console.log('No game');
        }
        // const cells = (this.game as GameDBEntity).field;
        const cells = Object.keys(this.game.field).reduce((acc, curr) => {
            acc[curr] = this.game.field[curr] || '.';
            return acc;
        }, {});
        console.log(`
    ${cells['[-1,1]']}|${cells['[0,1]']}|${cells['[1,1]']}
    ${cells['[-1,0]']}|${cells['[0,0]']}|${cells['[1,0]']}
    ${cells['[-1,-1]']}|${cells['[0,-1]']}|${cells['[1,-1]']}
    `);
    }
}
const gameRepository = new game_repository_1.GameRepository();
const gameService = new game_service_1.GameService(gameRepository);
const gameController = new game_controller_1.GameController(gameService);
// const ui1 = new UI('1');
// (async function() {
//   await ui1.loadGame();
//   await ui1.makeMove('1', [0, 1]);
//   setTimeout(async () => {
//     await ui1.makeMove('0', [-1, 0]);
//   }, 0);
//   setTimeout(async () => {
//     await ui1.makeMove('1', [0, -1]);
//   }, 0);
//   setTimeout(async () => {
//     await ui1.makeMove('0', [1, 0]);
//   }, 0);
// })()
const ui0 = new UI('0');
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield ui0.loadGame();
        yield ui0.addPlayer('0', 'o');
        yield ui0.addPlayer('1', 'x');
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.startGame();
        }), 0);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.makeMove('0', [-1, 0]);
        }), 0);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.makeMove('1', [0, 0]);
        }), 0);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.makeMove('0', [-1, 1]);
        }), 0);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.makeMove('1', [1, 1]);
        }), 0);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.makeMove('0', [0, 1]);
        }), 0);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield ui0.makeMove('1', [-1, -1]);
        }), 0);
    });
})();
