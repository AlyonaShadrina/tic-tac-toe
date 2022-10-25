"use strict";
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
exports.verify = void 0;
const google_auth_library_1 = require("google-auth-library");
// TODO: test with incorrect client id
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const client = new google_auth_library_1.OAuth2Client(clientId);
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: clientId, // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        return payload === null || payload === void 0 ? void 0 : payload['sub'];
    });
}
exports.verify = verify;
