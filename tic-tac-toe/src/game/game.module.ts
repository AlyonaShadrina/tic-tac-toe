import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { Game, GameSchema } from './entities/game.schema';
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository, AuthService, GameGateway],
})
export class GameModule {}
