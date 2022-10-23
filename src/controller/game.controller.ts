import * as http from 'node:http';
import { ActionResult } from '../domain/ActionResult';
import { TCoordinates, TFieldSymbol } from "../domain/types";
import { IGameService } from "../service/game.service";
import { IPlayerDBEntity } from "../storage/game.db-entity";
import { TId } from "../types";

export class GameController {
  constructor(
    private readonly _gameService: IGameService,
    private readonly _server: http.Server,
  ) {   
    const _that = this;
    this._server.on('request', async (req, res) => {
      const headers = {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
      };     

      const isGamesUrl = req.url?.includes('/api/games'); 
      const gameId = req.url?.split('/')[3];
      const path = req.url?.split('/')[4];

      if (req.method === "GET" && isGamesUrl) {
        if (!gameId) {
          res.writeHead(404, headers);
          return res.end('no game id provided');
        }
        const loadGameResult = await _that.loadGame(gameId);
        res.writeHead(200, headers);
        return res.end(JSON.stringify(loadGameResult.info.data));
      }
      
      else if (req.method === "POST" && gameId && path === 'start') {
        const startGameResult = await _that.startGame(gameId);
        if (!ActionResult.isSuccess(startGameResult)) {
          res.writeHead(400, headers);
          return res.end(JSON.stringify(startGameResult.info));
        }
        res.writeHead(200, headers);
        return res.end(JSON.stringify(startGameResult.info.data));
      }

      else if (req.method === "POST" && gameId && path === 'players') {
        // TODO: do not store it in variable, use stream pipes somehow
        const requestBody: any[] = [];
        req.on('data', (chunks) => { requestBody.push(chunks); });      
        req.on('end', async function() {
          const reqBody = Buffer.concat(requestBody).toString();
          const playerToAdd = JSON.parse(reqBody);
          if (playerToAdd) {
            const addPlayerResult = await _that.addPlayer(gameId, playerToAdd.userId, playerToAdd.symbol);
            if (!ActionResult.isSuccess(addPlayerResult)) {
              res.writeHead(400, headers);
              return res.end(JSON.stringify(addPlayerResult.info));
            }
            res.writeHead(200, headers);
            return res.end(JSON.stringify(addPlayerResult.info.data));
          }
          res.writeHead(400, headers);
          return res.end(JSON.stringify('No player provided'));
        });
      }

      else if (req.method === "POST" && gameId && path === 'move') {
        // TODO: do not store it in variable, use stream pipes somehow
        const requestBody: any[] = [];
        req.on('data', (chunks) => { requestBody.push(chunks); });      
        req.on('end', async function() {
          const reqBody = Buffer.concat(requestBody).toString();
          const moveInfo = JSON.parse(reqBody);
          if (moveInfo) {
            const makeMoveResult = await _that.makeMove(gameId, moveInfo.userId, moveInfo.coordinates);
            // TODO: why?
            // @ts-ignore
            if (!ActionResult.isSuccess(makeMoveResult)) {
              res.writeHead(400, headers);
              return res.end(JSON.stringify(makeMoveResult.info));
            }
            res.writeHead(200, headers);
            return res.end(JSON.stringify(makeMoveResult.info.data));
          }
          res.writeHead(400, headers);
          return res.end(JSON.stringify('No move info provided'));
        });
      }

      else if (req.method === "POST" && isGamesUrl) {
        // TODO: do not store it in variable, use stream pipes somehow
        const requestBody: any = [];
        req.on('data', (chunks) => { requestBody.push(chunks); });      
        req.on('end', async function() {
          const reqBody = Buffer.concat(requestBody).toString();          
          const createGameResult = await _that.createGame(JSON.parse(reqBody) as any|| []);
          
          if (!ActionResult.isSuccess(createGameResult)) {
            res.writeHead(400, headers);
            return res.end(JSON.stringify(createGameResult.info.data));
          }
          res.writeHead(200, headers);
          return res.end(JSON.stringify(createGameResult.info.data));
        });
      }
      
      else {
        res.writeHead(404, headers);
        return res.end('no such enpoint');
      }

    })    
  }

  async loadGame(gameId: TId) {
    return this._gameService.loadGame(gameId);
  }

  async makeMove(gameId: TId, userId: TId, coordinates: TCoordinates) {
    return this._gameService.makeMove({ gameId, userId, coordinates });
  }

  async addPlayer(gameId: TId, userId: TId, symbol: TFieldSymbol) {
    return this._gameService.addPlayer({ gameId, userId, symbol });
  }

  async startGame(gameId: TId) {
    return this._gameService.startGame(gameId);
  }

  async createGame(players: IPlayerDBEntity[]) {
    return this._gameService.createGame(players);
  }
}