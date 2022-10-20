"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionResultError = exports.ActionResultSuccess = exports.ActionResult = void 0;
class ActionResult {
    static isSuccess(actionResult) {
        return actionResult.type === 'success';
    }
}
exports.ActionResult = ActionResult;
class ActionResultSuccess {
    constructor(message, data) {
        this.type = 'success';
        this.info = {
            message,
            data
        };
    }
}
exports.ActionResultSuccess = ActionResultSuccess;
class ActionResultError {
    constructor(message, data) {
        this.type = 'error';
        this.info = {
            message,
            data
        };
    }
}
exports.ActionResultError = ActionResultError;
