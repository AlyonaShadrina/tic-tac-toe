import { IsNotEmpty } from 'class-validator';

export class AddPlayerDto {
  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  authenticatedUserId: string;
}
