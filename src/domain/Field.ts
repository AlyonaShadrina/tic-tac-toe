import { ActionResultError, ActionResultSuccess, IActionResult } from "./ActionResult";
import { TCoordinates } from "./types";

export interface IField {
  cells: Record<string, string | null>;
  setCellContent(coordinates: TCoordinates, symbol: string): IActionResult<null>;
  hasNSymbolsInRow(coordinates: TCoordinates, symbol: string, n: number): boolean;
}
export class Field implements IField {
  constructor(
    public cells: IField['cells']
  ) {}

  static createEmptyField(): IField {
    const coordinates = [    
      [-1, 1],
      [0, 1],
      [1, 1],
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];

    return new Field(coordinates.reduce((acc, curr) => {
      acc[JSON.stringify(curr)] = null
      return acc;
    }, {} as Record<string, null>))
  }
  
  private checkCellAvailable(coordinates: [number, number]) {
    return !this.cells[JSON.stringify(coordinates)]
  }

  setCellContent(coordinates: [number, number], symbol: string) {
    if (this.checkCellAvailable(coordinates)) {
      this.cells[JSON.stringify(coordinates)] = symbol;
      return new ActionResultSuccess('Player made a move', null);
    }
    return new ActionResultError('Coordinates are not available', null);
  }

  // TODO: create registry of already checked surrounding coordinates
  hasNSymbolsInRow(coordinates: [number, number], symbol: string, n: number): boolean {
    // get all surronding cells
    const potentialySurroundingCoordinates = [
      [coordinates[0] + 1, coordinates[1]],
      [coordinates[0] - 1, coordinates[1]],
      [coordinates[0], coordinates[1] + 1],
      [coordinates[0], coordinates[1] - 1],
      [coordinates[0] + 1, coordinates[1] + 1],
      [coordinates[0] - 1, coordinates[1] - 1],
      [coordinates[0] - 1, coordinates[1] + 1],
      [coordinates[0] + 1, coordinates[1] - 1],
    ].map(coordinatesNumbers => JSON.stringify(coordinatesNumbers));

    // get surronding cells with relevant symbol
    const existingSurroundingCoordinates = potentialySurroundingCoordinates.filter(
      coordinatesStrings => this.cells[coordinatesStrings] === symbol
    );

    // check if next cell within provided vector has relevant symbol
    const checkPrevCellSymbol = (coordinate: TCoordinates, vector: TCoordinates, potentionalyWinRow: any) => {
      const prevPotentialCoordinate: TCoordinates = [coordinate[0] - vector[0], coordinate[1] - vector[1]];
      const prevPotentialCoordinateString = JSON.stringify(prevPotentialCoordinate);
      if (this.cells[prevPotentialCoordinateString] === symbol) {
        potentionalyWinRow.push(prevPotentialCoordinate)
        if (potentionalyWinRow.length !== n) {
          checkPrevCellSymbol(prevPotentialCoordinate, vector, potentionalyWinRow)
        }
      }
    }
    const checkNextCellSymbol = (coordinate: TCoordinates, vector: TCoordinates, potentionalyWinRow: any) => {
      const nextPotentialCoordinate: TCoordinates = [coordinate[0] + vector[0], coordinate[1] + vector[1]];
      const nextPotentialCoordinateString = JSON.stringify(nextPotentialCoordinate);
      if (this.cells[nextPotentialCoordinateString] === symbol) {
        potentionalyWinRow.push(nextPotentialCoordinate)
        if (potentionalyWinRow.length !== n) {
          checkNextCellSymbol(nextPotentialCoordinate, vector, potentionalyWinRow)
        }
      }
    }

    for (let i = 0; i < existingSurroundingCoordinates.length; i++) {        
      const currentCoordinatesString = existingSurroundingCoordinates[i];
      const currentCoordinatesNumber = JSON.parse(currentCoordinatesString);
      const currentCoordinatesX = currentCoordinatesNumber[0];
      const currentCoordinatesY = currentCoordinatesNumber[1];

      const potentionalyWinRow = [coordinates, currentCoordinatesNumber];

      const vector: TCoordinates = [currentCoordinatesX - coordinates[0], currentCoordinatesY - coordinates[1]];

      // check next coordinates in provided vector
      const nextPotentialCoordinate: TCoordinates = [currentCoordinatesX + vector[0], currentCoordinatesY + vector[1]];      
      const nextPotentialCoordinateString = JSON.stringify(nextPotentialCoordinate);
      if (this.cells[nextPotentialCoordinateString] === symbol) {
        potentionalyWinRow.push(nextPotentialCoordinate)
        if (potentionalyWinRow.length !== n) {
          checkNextCellSymbol(nextPotentialCoordinate, vector, potentionalyWinRow)
        }
      }
      // if no more next, check prev coordinates in provided -vector
      if (potentionalyWinRow.length !== n) {
        const prevPotentialCoordinate: TCoordinates = [coordinates[0] - vector[0], coordinates[1] - vector[1]];
        const prevPotentialCoordinateString = JSON.stringify(prevPotentialCoordinate);
        if (this.cells[prevPotentialCoordinateString] === symbol) {
          potentionalyWinRow.push(prevPotentialCoordinate)
          if (potentionalyWinRow.length !== n) {
            checkPrevCellSymbol(prevPotentialCoordinate, vector, potentionalyWinRow)
          }
        }
      }
      if (potentionalyWinRow.length === n) {
        return true
      }
    }
    return false
  }
}
