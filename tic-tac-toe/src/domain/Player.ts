export interface IPlayer {
  symbol: string;
}
export class Player implements IPlayer {
  constructor(public symbol: string) {
    this.symbol = symbol;
  }
}
