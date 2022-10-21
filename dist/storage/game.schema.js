"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSchema = void 0;
const mongoose_1 = require("mongoose");
exports.gameSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['created', 'in_progress', 'finished'],
    },
    // players: [{ id: { type: Types.ObjectId, ref: 'User' }, symbol: String }],
    currentPlayerMoveIndex: Number,
    field: Object,
}, { collection: 'games' });
