"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypt = void 0;
const bcrypt_1 = require("bcrypt");
class Crypt {
    hash(passowrd) {
        return (0, bcrypt_1.hashSync)(passowrd, 10);
    }
    compare(password, userPassword) {
        return (0, bcrypt_1.compareSync)(password, userPassword);
    }
}
exports.Crypt = Crypt;
//# sourceMappingURL=hashPassword.js.map