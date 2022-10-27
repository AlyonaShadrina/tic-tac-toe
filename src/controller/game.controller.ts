import express, { Express, Request, Response, NextFunction } from 'express';
import { body, checkSchema, validationResult } from 'express-validator';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { ActionResult } from '../domain/ActionResult';
import { TCoordinates, TFieldSymbol } from "../domain/types";
import { IGameService } from "../service/game.service";
import { IPlayerDBEntity } from "../storage/game.db-entity";
import { TId } from "../types";
import { verify } from '../verifyIdToken';

export class GameController {
  constructor(
    private readonly _gameService: IGameService,
    private readonly _app: Express,
    private readonly _io: Server,
  ) {
    this._app.use(express.json());
    this._app.use(helmet())
    this._app.use(this.setHeaders);
    this._app.use(this.authenticate);
    
    this._app.post('/api/games', async (req, res) => {     
      const loadGameResult = await this.createGame([]);
      if (!ActionResult.isSuccess(loadGameResult)) {
        res.status(400);
        res.json(loadGameResult.info);
      } else {
        res.status(200);
        res.json(loadGameResult.info.data)
      }
    })
    
    this._app.get('/api/games/:gameId', async (req, res) => {
      const loadGameResult = await this.loadGame(req.params.gameId);
      if (!ActionResult.isSuccess(loadGameResult)) {
        res.status(404);
        res.json(loadGameResult.info);
      } else {
        res.status(200);
        res.json(loadGameResult.info.data)
      }
    })
    
    this._app.post('/api/games/:gameId/start', async (req, res) => {
      const startGameResult = await this.startGame(req.params.gameId);
      if (!ActionResult.isSuccess(startGameResult)) {
        res.status(400);
        res.json(startGameResult.info);
      } else {
        res.status(200);
        res.json(startGameResult.info.data)
        this._io.emit(`${req.params.gameId}_start`);
      }
    })

    this._app.post(
      '/api/games/:gameId/players',
      body('symbol', 'Symbol is required').isString().not().isEmpty(),
      this.validateRequest,
      async (req, res) => {
        const addPlayerResult = await this.addPlayer(req.params?.gameId, req.body.authenticatedUserId, req.body.symbol);
        if (!ActionResult.isSuccess(addPlayerResult)) {
          res.status(400);
          res.json(addPlayerResult.info);
        } else {
          res.status(200);
          res.json(addPlayerResult.info.data)
          this._io.emit(`${req.params.gameId}_player`, addPlayerResult.info.data);
        }
      }
    )
    
    this._app.post(
      '/api/games/:gameId/move',
      checkSchema({
        coordinates: {
          custom: {
            options: (coordinates: unknown) => {
              if (Array.isArray(coordinates) && coordinates.length === 2) {
                const [x, y] = coordinates;
                return Number.isInteger(x) && Number.isInteger(y);
              }
              return false
            },
            errorMessage: 'Wrong coordinates',
          },
        },
      }),
      this.validateRequest,
      async (req: Request, res: Response) => {
        const makeMoveResult = await this.makeMove(req.params?.gameId, req.body.authenticatedUserId, req.body.coordinates);
        if (!ActionResult.isSuccess(makeMoveResult)) {
          res.status(400);
          res.json(makeMoveResult.info);
        } else {
          res.status(200);
          res.json(makeMoveResult.info.data)
          this._io.emit(`${req.params?.gameId}_move`, makeMoveResult.info.data);
        }
      }
    )    
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
    res.setHeader('Access-Control-Allow-Origin', process.env.HEADER_CORS_ALLOWED || 'same-origin');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader('Content-Type', 'application/json');
    next();
  }
  private validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedError = errors.formatWith(({ msg }) => msg);      
      return res.status(400).json({ data: formattedError.mapped(), message: formattedError.array().join('. ') });
    }
    next();
  }
}