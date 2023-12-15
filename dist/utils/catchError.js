"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
const catchError = async (promise) => {
    try {
        return await promise;
    }
    catch (error) {
        throw error;
    }
};
exports.catchError = catchError;
//# sourceMappingURL=catchError.js.map