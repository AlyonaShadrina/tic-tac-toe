"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
const Field_1 = require("./domain/Field");
const player1 = {
    symbol: 'o',
};
const player2 = {
    symbol: 'x',
};
exports.game = {
    status: 'in_progress',
    players: [player1, player2],
    currentPlayerMoveIndex: 0,
    field: new Field_1.Field({
        '[-1,1]': 'o',
        '[0,1]': null,
        '[1,1]': null,
        '[-1,0]': 'o',
        '[0,0]': null,
        '[1,0]': null,
        '[-1,-1]': null,
        '[0,-1]': null,
        '[1,-1]': null
    }),
};
