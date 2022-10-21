"use strict";
// import { Field } from "../domain/Field";
// import { GameDBEntity } from "./game.db-entity";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
// const { MongoClient } = require("mongodb");
// require('dotenv').config();
// console.log('process.env', process.env.DB_CONFIG_USERNAME);
// // Replace the following with your Atlas connection string                                                                                                                                        
// const url = `mongodb+srv://${process.env.DB_CONFIG_USERNAME}:${process.env.DB_CONFIG_PASSWORD}@gamecluster.gxdid8x.mongodb.net/?retryWrites=true&w=majority`;
// export async function run() {
//     try {
//       await client.connect();
//       console.log("Connected correctly to server");
//       const db = client.db('tic-tac-toe');
//         // Use the collection "people"
//         const col = db.collection("games");
//         // Construct a document                                                                                                                                                              
//         const game = new GameDBEntity(0, [], Field.createEmptyField().cells, 'created');
//         // Insert a single document, wait for promise so we can read it back
//         const p = await col.insertOne(game);
//         // Find one document
//         const myDoc = await col.findOne();
//         // Print to the console
//         console.log(myDoc);
//     } catch (err) {
//         console.log((err as any).stack);
//     }
//     finally {
//         await client.close();
//     }
// }
const { MongoClient } = require("mongodb");
require('dotenv').config();
// Replace the following with your Atlas connection string                                                                                                                                        
const url = `mongodb+srv://${process.env.DB_CONFIG_USERNAME}:${process.env.DB_CONFIG_PASSWORD}@gamecluster.gxdid8x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connected correctly to server");
        }
        catch (err) {
            // @ts-ignore
            console.log(err.stack);
        }
        finally {
            yield client.close();
        }
    });
}
exports.run = run;
// run().catch(console.dir);
