import express, { Express, Request, Response, NextFunction } from 'express';
import { ActionResult } from '../domain/ActionResult';
import { TCoordinates, TFieldSymbol } from "../domain/types";
import { IGameService } from "../service/game.service";
import { IPlayerDBEntity } from "../storage/game.db-entity";
import { TId } from "../types";
import { verify } from '../verifyIdToken';

// TODO: check if data in request is valid
export class GameController {
  constructor(
    private readonly _gameService: IGameService,
    private readonly _server: Express,
  ) {
    this._server.use(express.json());
    this._server.use(this.setHeaders);
    this._server.use(this.authenticate);

    this._server.post('/api/games', async (req, res) => {     
      const loadGameResult = await this.createGame([]);
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
      const addPlayerResult = await this.addPlayer(req.params.gameId, req.body.authenticatedUserId, req.body.symbol);
      if (!ActionResult.isSuccess(addPlayerResult)) {
        res.status(400);
        res.json(addPlayerResult.info);
      } else {
        res.status(200);
        res.json(addPlayerResult.info.data)
      }
    })
    
    this._server.post('/api/games/:gameId/move', async (req, res) => {
      const addPlayerResult = await this.makeMove(req.params.gameId, req.body.authenticatedUserId, req.body.coordinates);
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

  private async authenticate(req: Request, res: Response, next: NextFunction) {
    // TODO: should it really work that way?
    if (req.method !== 'OPTIONS') {
      if (req.headers.authorization) {
        try {
          const userId = await verify(req.headers.authorization);
          if (userId) {
            req.body.authenticatedUserId = userId;
            next();
          }
        } catch (e) {
          console.log('auth error');
          res.status(401);
          res.end();
        }
      } else {
        res.status(401);
        res.end();
      }
    } else {
      next();
    }
  }
  private setHeaders(req: Request, res: Response, next: NextFunction) {
    // TODO: research on privacy
    res.setHeader('Access-Control-Allow-Origin', process.env.HEADER_CORS_ALLOWED || '');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader('Content-Type', 'application/json');
    next();
  }
}