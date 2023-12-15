"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./entities/users.entity");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const utils_1 = require("../utils");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.registerAsync({
                useFactory: () => ({
                    storage: multer.diskStorage({
                        filename(req, file, callback) {
                            callback(null, file.originalname);
                        },
                    }),
                    fileFilter: (req, file, cb) => {
                        if (file.mimetype.startsWith('image') ||
                            file.mimetype.startsWith('video') ||
                            file.mimetype.startsWith('application/pdf'))
                            cb(null, true);
                        else
                            cb(new common_1.BadRequestException('Only images or videos'), null);
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.User]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, utils_1.Crypt, utils_1.Pagination],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map