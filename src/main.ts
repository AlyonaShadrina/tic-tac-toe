import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { GameController } from "./controller/game.controller";
import { GameService } from "./service/game.service";
import { GameDBEntity } from "./storage/game.db-entity";
import { GameRepository } from "./storage/game.repository";
import { TId } from "./types";
import { TCoordinates, TFieldSymbol } from "./domain/types";
import GameModel from "./storage/game.model";

dotenv.config();

const url = `mongodb+srv://${process.env.DB_CONFIG_USERNAME}:${process.env.DB_CONFIG_PASSWORD}@gamecluster.gxdid8x.mongodb.net/?retryWrites=true&w=majority`;

main().catch(err => console.log(err));

async function main () {

await connect(url, { dbName: 'tic-tac-toe' });

class UI {
  game: GameDBEntity | null;
  gameId: TId;

  constructor(gameId: TId) {
    this.game = null;
    this.gameId = gameId;
  }

  async loadGame() {
    const result = await gameController.loadGame(this.gameId);
    this.game = result.info.data;
    this.printUI();
  }

  async makeMove(userId: TId, coordinates: TCoordinates) {
    const result = await gameController.makeMove(this.gameId, userId, coordinates);
    console.log('makeMove result', result);
    this.loadGame();
  }

  async addPlayer(userId: TId, symbol: TFieldSymbol) {
    const result = await gameController.addPlayer(this.gameId, userId, symbol);
    console.log('addPlayer result', result);
    this.loadGame();
  }

  async startGame() {
    const result = await gameController.startGame(this.gameId);
    console.log('startGame result', result);
    this.loadGame();
  }

  printUI() {
    this.printField();
    this.printStatus();
  }

  printStatus() {
    console.log('game status: ', this.game?.status);
  }

  printField() {
    if (!this.game) {
      console.log('No game');
    }
    // const cells = (this.game as GameDBEntity).field;
    const cells = Object.keys((this.game as GameDBEntity).field).reduce((acc, curr) => {
      acc[curr] = (this.game as GameDBEntity).field[curr] || '.'
      return acc
    }, {} as any)
    console.log(`
    ${cells['[-1,1]']}|${cells['[0,1]']}|${cells['[1,1]']}
    ${cells['[-1,0]']}|${cells['[0,0]']}|${cells['[1,0]']}
    ${cells['[-1,-1]']}|${cells['[0,-1]']}|${cells['[1,-1]']}
    `);
  }
}

  // @ts-ignore
const gameRepository = new GameRepository(
  GameModel,
);

const gameService = new GameService(
  gameRepository
);

const gameController = new GameController(
  gameService
);

const ui1 = new UI('63514c97d00f343cdb2f99ba');

(async function() {
  await ui1.loadGame();
  await ui1.addPlayer('63528122553c55811f382ac8', 'o');
  await ui1.startGame();
  // setTimeout(async () => {
  //   await ui1.makeMove('0', [-1, 0]);
  // }, 0);
  
  // setTimeout(async () => {
  //   await ui1.makeMove('1', [0, -1]);
  // }, 0);
  // setTimeout(async () => {
  //   await ui1.makeMove('0', [1, 0]);
  // }, 0);
})()

// const ui0 = new UI('0');

// (async function() {
//   await ui0.loadGame();
//   await ui0.addPlayer('0', 'o');
//   await ui0.addPlayer('1', 'x');
//   setTimeout(async () => {
//     await ui0.startGame();
//   }, 0);
//   setTimeout(async () => {
//     await ui0.makeMove('0', [-1, 0]);
//   }, 0);
//   setTimeout(async () => {
//     await ui0.makeMove('1', [0, 0]);
//   }, 0);
//   setTimeout(async () => {
//     await ui0.makeMove('0', [-1, 1]);
//   }, 0);
//   setTimeout(async () => {
//     await ui0.makeMove('1', [1, 1]);
//   }, 0);
//   setTimeout(async () => {
//     await ui0.makeMove('0', [0, 1]);
//   }, 0);
//   setTimeout(async () => {
//     await ui0.makeMove('1', [-1, -1]);
//   }, 0);
// })()

}
