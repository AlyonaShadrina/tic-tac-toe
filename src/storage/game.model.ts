import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['created', 'in_progress', 'finished'],
      required: true,
    },
    players: {
      type: [{ 
        // TODO: in a perfect wat, this should be a fore
        // _userId: { 
        //   type: Schema.Types.ObjectId,
        //   ref: 'User',
        //   required: true,
        // },
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
  },
  { collection: 'games' }
);

const GameModel = model('Game', gameSchema);

export default GameModel;