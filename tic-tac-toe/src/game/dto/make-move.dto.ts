import { IsNotEmpty, Validate } from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'coordinates', async: false })
export class Coordinates implements ValidatorConstraintInterface {
  validate(coordinates: unknown) {
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      const [x, y] = coordinates;
      return Number.isInteger(x) && Number.isInteger(y);
    }
    return false;
  }

  defaultMessage() {
    return 'Wrong coordinates';
  }
}
export class MakeMoveDto {
  @Validate(Coordinates)
  coordinates: [number, number];

  @IsNotEmpty()
  authenticatedUserId: string;
}
