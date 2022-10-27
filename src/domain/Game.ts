import { ActionResult, ActionResultError, ActionResultSuccess, IActionResult } from "./ActionResult";
import { IField } from "./Field";
import { IPlayer, Player } from "./Player";
import { TCoordinates, TFieldSymbol, TGameStatus } from "./types";

type TFieldCellUpdates = {
  coordinates: TCoordinates;
  symbol: TFieldSymbol;
};
export type TMakeMoveUpdates = {
  fieldCell: TFieldCellUpdates,
  status: TGameStatus,
  currentPlayerMoveIndex: number,
};

export class Game {
  constructor(
    public status: TGameStatus,
    public players: IPlayer[],
    public currentPlayerMoveIndex: number,
    public field: IField,
  ) {}

  addPlayer(player: IPlayer) {
    if (this.status !== 'created') {
      return new ActionResultError('Game already started', null);
    }
    if (this.isSymbolRegistered(player.symbol)) {
      return new ActionResultError('Symbol is already taken', null);
    }
    
    this.players.push(player);
    return new ActionResultSuccess('Player have been added to game', null);
  }

  startGame() {
    if (this.status === 'finished') {
      return new ActionResultError('Game already finished', null);
    }
    if (!this.players.length) {
      return new ActionResultError('No users', null);
    }
    this.status = 'in_progress';
    return new ActionResultSuccess('Game started', null);
  }

  makeMove(coordinates: TCoordinates, symbol: TFieldSymbol): ReturnType<IField['setCellContent']> | IActionResult<null | TMakeMoveUpdates> {  
    if (this.status !== 'in_progress') {
      return new ActionResultError('Game not in progress', null);
    }
    if (!this.isSymbolRegistered(symbol)) {
      return new ActionResultError('Symbol is not registered in this game', null);
    }
    if (!this.isSymbolTurn(symbol)) {
      return new ActionResultError("It's not your turn to make a move", null);
    }

    const setCellContentResult = this.field.setCellContent(coordinates, symbol);
    if (!ActionResult.isSuccess(setCellContentResult)) {
      return setCellContentResult;
    }
    
    if (this.field.hasNSymbolsInRow(coordinates, symbol, 3)) {
      this.status = 'finished';
      return new ActionResultSuccess('Move made, game won', {
        fieldCell: { coordinates, symbol },
        status: this.status,
        currentPlayerMoveIndex: this.currentPlayerMoveIndex,
      });
    }
    this.currentPlayerMoveIndex = this.currentPlayerMoveIndex === this.players.length - 1 ? 0 : this.currentPlayerMoveIndex + 1;
    return new ActionResultSuccess('Move made', {
      fieldCell: { coordinates, symbol },
      status: this.status,
      currentPlayerMoveIndex: this.currentPlayerMoveIndex,
    });
  }

  private isSymbolTurn(symbol: string) {  
    return this.players[this.currentPlayerMoveIndex].symbol === symbol;
  }

  private isSymbolRegistered(symbol: string) {
    return this.players.find(exitingPlayer => exitingPlayer.symbol === symbol);
  }
}
