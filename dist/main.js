"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const http = __importStar(require("node:http"));
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const game_controller_1 = require("./controller/game.controller");
const game_service_1 = require("./service/game.service");
const game_repository_1 = require("./storage/game.repository");
const game_model_1 = __importDefault(require("./storage/game.model"));
dotenv_1.default.config();
const url = `mongodb+srv://${process.env.DB_CONFIG_USERNAME}:${process.env.DB_CONFIG_PASSWORD}@gamecluster.gxdid8x.mongodb.net/?retryWrites=true&w=majority`;
main().catch(err => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongoose_1.connect)(url, { dbName: 'tic-tac-toe' });
        // class UI {
        //   game: GameDBEntity | null;
        //   gameId?: TId;
        //   constructor(gameId?: TId) {
        //     this.game = null;
        //     this.gameId = gameId;
        //   }
        //   async loadGame() {
        //     if (this.gameId) {
        //       const result = await gameController.loadGame(this.gameId);
        //       this.game = result.info.data;
        //       this.printUI();
        //     }
        //   }
        //   async makeMove(userId: TId, coordinates: TCoordinates) {
        //     if (this.gameId) {
        //       const result = await gameController.makeMove(this.gameId, userId, coordinates);
        //       console.log('makeMove result', result);
        //       this.loadGame();
        //     }
        //   }
        //   async addPlayer(userId: TId, symbol: TFieldSymbol) {
        //     if (this.gameId) {
        //       const result = await gameController.addPlayer(this.gameId, userId, symbol);
        //       console.log('addPlayer result', result);
        //       this.loadGame();
        //     }
        //   }
        //   async startGame() {
        //     if (this.gameId) {
        //       const result = await gameController.startGame(this.gameId);
        //       console.log('startGame result', result);
        //       this.loadGame();
        //     }
        //   }
        //   async createGame(players: IPlayerDBEntity[]) {
        //     const result = await gameController.createGame(players);
        //     console.log('createGame result', result)
        //     if (ActionResult.isSuccess(result)) {
        //       this.gameId = result.info.data.id as string;
        //       this.loadGame();
        //     }
        //   }
        //   printUI() {
        //     this.printField();
        //     this.printStatus();
        //   }
        //   printStatus() {
        //     console.log('game status: ', this.game?.status);
        //   }
        //   printField() {
        //     if (!this.game) {
        //       console.log('No game');
        //     }
        //     // const cells = (this.game as GameDBEntity).field;
        //     const cells = Object.keys((this.game as GameDBEntity).field).reduce((acc, curr) => {
        //       acc[curr] = (this.game as GameDBEntity).field[curr] || '.'
        //       return acc
        //     }, {} as any)
        //     console.log(`
        //     ${cells['[-1,1]']}|${cells['[0,1]']}|${cells['[1,1]']}
        //     ${cells['[-1,0]']}|${cells['[0,0]']}|${cells['[1,0]']}
        //     ${cells['[-1,-1]']}|${cells['[0,-1]']}|${cells['[1,-1]']}
        //     `);
        //   }
        // }
        const gameRepository = new game_repository_1.GameRepository(game_model_1.default);
        const gameService = new game_service_1.GameService(gameRepository);
        const server = yield http.createServer().listen(process.env.PORT);
        console.log(`Server running at http://127.0.0.1:${process.env.PORT}/`);
        const gameController = new game_controller_1.GameController(gameService, server);
        // const ui1 = new UI('63514c97d00f343cdb2f99ba');
        // (async function() {
        //   // await ui1.createGame([{ userId: '63528122553c55811f382ac8', symbol: 'o'}]);
        //   // await ui1.loadGame();
        //   // await ui1.addPlayer('63528122553c55811f382ac8', 'o');
        //   // await ui1.addPlayer('63528136553c55811f382ac9', 'x');
        //   // await ui1.startGame();
        //   // await ui1.makeMove('63528122553c55811f382ac8', [0, 0]);
        // })()
    });
}
