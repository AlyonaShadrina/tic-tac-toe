import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { TMakeMoveUpdates } from 'src/domain/Game';
import { GameDBEntity, IPlayerDBEntity } from './entities/game.entity';
import { Game, GameDocument } from './entities/game.schema';
import { TId } from 'src/types';

export interface IGameRepository {
  find(gameId: TId): Promise<GameDBEntity | null>;
  update(gameId: TId, gameUpdates: TMakeMoveUpdates): Promise<void>;
  addPlayer(gameId: TId, player: IPlayerDBEntity): Promise<void>;
  create(game: GameDBEntity): Promise<GameDBEntity>;
  startGame(gameId: TId): Promise<void>;
}

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectModel(Game.name)
    private readonly _gameModel: typeof Model<GameDocument>,
  ) {}

  async find(gameId: TId): Promise<GameDBEntity | null> {
    try {
      const result = await this._gameModel.findOne({
        _id: new ObjectId(gameId),
      });
      return result ? result.toObject({ getters: true }) : result;
    } catch (e) {
      return null;
    }
  }

  async update(gameId: TId, gameUpdates: TMakeMoveUpdates) {
    await this._gameModel.findOneAndUpdate(
      { _id: gameId },
      {
        status: gameUpdates.status,
        currentPlayerMoveIndex: gameUpdates.currentPlayerMoveIndex,
        [`field.[${gameUpdates.fieldCell.coordinates}]`]:
          gameUpdates.fieldCell.symbol,
      },
    );
  }

  async addPlayer(gameId: TId, player: IPlayerDBEntity) {
    await this._gameModel.findOneAndUpdate(
      { _id: gameId },
      { $push: { players: { userId: player.userId, symbol: player.symbol } } },
    );
  }

  async create(game: GameDBEntity): Promise<GameDBEntity> {
    const newGame = await new this._gameModel(game as GameDocument).save();
    return newGame.toObject({ getters: true });
  }

  async startGame(gameId: TId) {
    await this._gameModel.findOneAndUpdate(
      { _id: gameId },
      { status: 'in_progress' },
    );
  }
}
