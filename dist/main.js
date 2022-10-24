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
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const game_controller_1 = require("./controller/game.controller");
const game_service_1 = require("./service/game.service");
const game_repository_1 = require("./storage/game.repository");
const game_model_1 = __importDefault(require("./storage/game.model"));
// const app = express();
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
dotenv_1.default.config();
const url = `mongodb+srv://${process.env.DB_CONFIG_USERNAME}:${process.env.DB_CONFIG_PASSWORD}@gamecluster.gxdid8x.mongodb.net/?retryWrites=true&w=majority`;
main().catch(err => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongoose_1.connect)(url, { dbName: 'tic-tac-toe' });
        console.log(`DB connected`);
        // const server = await http.createServer().listen(process.env.PORT)
        const app = (0, express_1.default)();
        app.listen(process.env.PORT);
        console.log(`Server running at http://127.0.0.1:${process.env.PORT}/`);
        const gameRepository = new game_repository_1.GameRepository(game_model_1.default);
        const gameService = new game_service_1.GameService(gameRepository);
        new game_controller_1.GameController(gameService, app);
    });
}
