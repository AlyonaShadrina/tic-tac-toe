import { Field } from "../domain/Field";
import { TGameStatus } from "../domain/types";
import { TId } from "../types";

export interface IPlayerDBEntity { userId: TId, symbol: string };

export interface IFieldDBEntity { [key: string]: string | null };

export interface IGameDBEntity {
  id?: TId;
  currentPlayerMoveIndex: number;
  players: IPlayerDBEntity[];
  field: IFieldDBEntity;
  status: TGameStatus;
}

export class GameDBEntity implements IGameDBEntity{
  constructor(
    public currentPlayerMoveIndex: number,
    public players: IPlayerDBEntity[],
    public field: IFieldDBEntity,
    public status: TGameStatus,
    public id?: TId,
  ) {}

  static createDefaultGame({
    currentPlayerMoveIndex = 0,
    players = [],
    field = Field.createEmptyField().cells,
    status = 'created',
  }: Partial<IGameDBEntity>): IGameDBEntity {
    return new GameDBEntity(
      currentPlayerMoveIndex,
      players,
      field,
      status,
    )
  }
}