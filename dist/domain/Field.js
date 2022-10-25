"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const ActionResult_1 = require("./ActionResult");
class Field {
    constructor(cells) {
        this.cells = cells;
    }
    static createEmptyField() {
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
            acc[JSON.stringify(curr)] = null;
            return acc;
        }, {}));
    }
    checkCellAvailable(coordinates) {
        return !this.cells[JSON.stringify(coordinates)];
    }
    setCellContent(coordinates, symbol) {
        if (this.checkCellAvailable(coordinates)) {
            this.cells[JSON.stringify(coordinates)] = symbol;
            return new ActionResult_1.ActionResultSuccess('Player made a move', null);
        }
        return new ActionResult_1.ActionResultError('Coordinates are not available', null);
    }
    // TODO: create registry of already checked surrounding coordinates
    hasNSymbolsInRow(coordinates, symbol, n) {
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
        const existingSurroundingCoordinates = potentialySurroundingCoordinates.filter(coordinatesStrings => this.cells[coordinatesStrings] === symbol);
        // check if next cell within provided vector has relevant symbol
        const checkPrevCellSymbol = (coordinate, vector, potentionalyWinRow) => {
            const prevPotentialCoordinate = [coordinate[0] - vector[0], coordinate[1] - vector[1]];
            const prevPotentialCoordinateString = JSON.stringify(prevPotentialCoordinate);
            if (this.cells[prevPotentialCoordinateString] === symbol) {
                potentionalyWinRow.push(prevPotentialCoordinate);
                if (potentionalyWinRow.length !== n) {
                    checkPrevCellSymbol(prevPotentialCoordinate, vector, potentionalyWinRow);
                }
            }
        };
        const checkNextCellSymbol = (coordinate, vector, potentionalyWinRow) => {
            const nextPotentialCoordinate = [coordinate[0] + vector[0], coordinate[1] + vector[1]];
            const nextPotentialCoordinateString = JSON.stringify(nextPotentialCoordinate);
            if (this.cells[nextPotentialCoordinateString] === symbol) {
                potentionalyWinRow.push(nextPotentialCoordinate);
                if (potentionalyWinRow.length !== n) {
                    checkNextCellSymbol(nextPotentialCoordinate, vector, potentionalyWinRow);
                }
            }
        };
        for (let i = 0; i < existingSurroundingCoordinates.length; i++) {
            const currentCoordinatesString = existingSurroundingCoordinates[i];
            const currentCoordinatesNumber = JSON.parse(currentCoordinatesString);
            const currentCoordinatesX = currentCoordinatesNumber[0];
            const currentCoordinatesY = currentCoordinatesNumber[1];
            const potentionalyWinRow = [coordinates, currentCoordinatesNumber];
            const vector = [currentCoordinatesX - coordinates[0], currentCoordinatesY - coordinates[1]];
            // check next coordinates in provided vector
            const nextPotentialCoordinate = [currentCoordinatesX + vector[0], currentCoordinatesY + vector[1]];
            const nextPotentialCoordinateString = JSON.stringify(nextPotentialCoordinate);
            if (this.cells[nextPotentialCoordinateString] === symbol) {
                potentionalyWinRow.push(nextPotentialCoordinate);
                if (potentionalyWinRow.length !== n) {
                    checkNextCellSymbol(nextPotentialCoordinate, vector, potentionalyWinRow);
                }
            }
            // if no more next, check prev coordinates in provided -vector
            if (potentionalyWinRow.length !== n) {
                const prevPotentialCoordinate = [coordinates[0] - vector[0], coordinates[1] - vector[1]];
                const prevPotentialCoordinateString = JSON.stringify(prevPotentialCoordinate);
                if (this.cells[prevPotentialCoordinateString] === symbol) {
                    potentionalyWinRow.push(prevPotentialCoordinate);
                    if (potentionalyWinRow.length !== n) {
                        checkPrevCellSymbol(prevPotentialCoordinate, vector, potentionalyWinRow);
                    }
                }
            }
            if (potentionalyWinRow.length === n) {
                return true;
            }
        }
        return false;
    }
}
exports.Field = Field;
