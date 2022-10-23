import * as http from 'node:http';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { GameController } from "./controller/game.controller";
import { GameService } from "./service/game.service";
import { GameRepository } from "./storage/game.repository";
import GameModel from "./storage/game.model";

dotenv.config();

const url = `mongodb+srv://${process.env.DB_CONFIG_USERNAME}:${process.env.DB_CONFIG_PASSWORD}@gamecluster.gxdid8x.mongodb.net/?retryWrites=true&w=majority`;

main().catch(err => console.log(err));

async function main () {
  await connect(url, { dbName: 'tic-tac-toe' });
  console.log(`DB connected`);

  const server = await http.createServer().listen(process.env.PORT)
  console.log(`Server running at http://127.0.0.1:${process.env.PORT}/`);

  const gameRepository = new GameRepository(
    GameModel,
  );

  const gameService = new GameService(
    gameRepository
  );

  new GameController(
    gameService,
    server,
  );
}
