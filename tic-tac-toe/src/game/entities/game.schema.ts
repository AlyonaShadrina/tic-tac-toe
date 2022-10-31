import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ required: true })
  status: 'created' | 'in_progress' | 'finished';

  @Prop({ required: true })
  players: {
    userId: string;
    symbol: string;
  }[];

  @Prop({ required: true })
  currentPlayerMoveIndex: number;

  @Prop({ required: true, type: Object })
  field: Record<string, string | null>;
}

export const GameSchema = SchemaFactory.createForClass(Game);
