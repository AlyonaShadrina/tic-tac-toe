import { IGameDBEntity } from "./game.db-entity";

export const users = [
  { id: '0', name: 'A', },
  { id: '1', name: 'B', },
];

export let games: IGameDBEntity[] = [
  {
    id: '0',
    status: 'created',
    players: [],
    currentPlayerMoveIndex: 0,
    field: {
      '[-1,1]': null,
      '[0,1]': null,
      '[1,1]': null,
      '[-1,0]': null,
      '[0,0]': null,
      '[1,0]': null,
      '[-1,-1]': null,
      '[0,-1]': null,
      '[1,-1]': null
    },
  },
  {
    id: '1',
    status: 'in_progress',
    players: [{ userId: '0', symbol: 'o' }, { userId: '1', symbol: 'x' }],
    currentPlayerMoveIndex: 1,
    field: {
      '[-1,1]': null,
      '[0,1]': null,
      '[1,1]': null,
      '[-1,0]': null,
      '[0,0]': 'o',
      '[1,0]': null,
      '[-1,-1]': null,
      '[0,-1]': null,
      '[1,-1]': null
    },
  },
  
  {
    id: '2',
    status: 'finished',
    players: [{ userId: '0', symbol: 'o' }, { userId: '1', symbol: 'x' }],
    currentPlayerMoveIndex: 0,
    field: {
      '[-1,1]': null,
      '[0,1]': null,
      '[1,1]': 'o',
      '[-1,0]': 'x',
      '[0,0]': 'o',
      '[1,0]': 'x',
      '[-1,-1]': 'o',
      '[0,-1]': null,
      '[1,-1]': null
    },
  }
];