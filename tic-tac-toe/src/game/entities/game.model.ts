import { Schema, model } from 'mongoose';

export const gameSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['created', 'in_progress', 'finished'],
      required: true,
    },
    players: {
      type: [
        {
          userId: {
            type: String,
            required: true,
          },
          symbol: {
            type: String,
            required: true,
          },
        },
      ],
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
  },
  { collection: 'games' },
);

const GameModel = model('Game', gameSchema);

export default GameModel;
