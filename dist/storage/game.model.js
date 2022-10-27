"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['created', 'in_progress', 'finished'],
        required: true,
    },
    players: {
        type: [{
                userId: {
                    type: String,
                    required: true,
                },
                symbol: {
                    type: String,
                    required: true,
                }
            }],
        required: true,
    },
    currentPlayerMoveIndex: {
        type: Number,
        required: true,
    },
    field: {
        type: Object,
        required: true,
    },
}, { collection: 'games' });
const GameModel = (0, mongoose_1.model)('Game', gameSchema);
exports.default = GameModel;
