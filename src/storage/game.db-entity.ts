import { TGameStatus } from "../domain/types";
import { TId } from "../types";

export interface IPlayerDBEntity { id: TId, symbol: string };

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
}