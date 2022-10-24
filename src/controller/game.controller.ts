import express, { Express } from 'express';
import { ActionResult } from '../domain/ActionResult';
import { TCoordinates, TFieldSymbol } from "../domain/types";
import { IGameService } from "../service/game.service";
import { IPlayerDBEntity } from "../storage/game.db-entity";
import { TId } from "../types";

// TODO: userId should be taken from auth info, not from params
export class GameController {
  constructor(
    private readonly _gameService: IGameService,
    private readonly _server: Express,
  ) {
    this._server.use(express.json());
    this._server.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', process.env.HEADER_CORS_ALLOWED || '');
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader('Content-Type', 'application/json');
      next();
    });

    this._server.post('/api/games', async (req, res) => {     
      const loadGameResult = await this.createGame(req.body);
      if (!ActionResult.isSuccess(loadGameResult)) {
        res.status(400);
        res.json(loadGameResult.info);
      } else {
        res.status(200);
        res.json(loadGameResult.info.data)
      }
    })
    
    this._server.get('/api/games/:gameId', async (req, res) => {
      const loadGameResult = await this.loadGame(req.params.gameId);
      if (!ActionResult.isSuccess(loadGameResult)) {
        res.status(404);
        res.json(loadGameResult.info);
      } else {
        res.status(200);
        res.json(loadGameResult.info.data)
      }
    })
    
    this._server.post('/api/games/:gameId/start', async (req, res) => {
      const startGameResult = await this.startGame(req.params.gameId);
      if (!ActionResult.isSuccess(startGameResult)) {
        res.status(400);
        res.json(startGameResult.info);
      } else {
        res.status(200);
        res.json(startGameResult.info.data)
      }
    })

    this._server.post('/api/games/:gameId/players', async (req, res) => {
      const addPlayerResult = await this.addPlayer(req.params.gameId, req.body.userId, req.body.symbol);
      if (!ActionResult.isSuccess(addPlayerResult)) {
        res.status(400);
        res.json(addPlayerResult.info);
      } else {
        res.status(200);
        res.json(addPlayerResult.info.data)
      }
    })
    
    this._server.post('/api/games/:gameId/move', async (req, res) => {
      const addPlayerResult = await this.makeMove(req.params.gameId, req.body.userId, req.body.coordinates);
      // TODO: why?
      // @ts-ignore
      if (!ActionResult.isSuccess(addPlayerResult)) {
        res.status(400);
        res.json(addPlayerResult.info);
      } else {
        res.status(200);
        res.json(addPlayerResult.info.data)
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