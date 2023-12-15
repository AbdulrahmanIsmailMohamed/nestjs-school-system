"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const role_enum_1 = require("../common/enums/role.enum");
const dtos_1 = require("./dtos");
const update_logged_user_dto_1 = require("./dtos/update-logged-user.dto");
const platform_express_1 = require("@nestjs/platform-express");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsers(paginationDto, keyword, req) {
        const users = await this.userService.getUsers(paginationDto, keyword, req.user.id);
        if (!users)
            throw new common_1.NotFoundException();
        return users;
    }
    async getMe(req) {
        const user = await this.userService.getUser(req.user.id);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
    async updateLoggedUser(req, updateLoggedUserDto, profileImage) {
        const user = await this.userService.updateLoggedUser(req.user.id, updateLoggedUserDto, profileImage);
        if (!user)
            throw new common_1.BadRequestException();
        return user;
    }
    async getUser(id) {
        const user = await this.userService.getUser(id);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER, role_enum_1.Role.TEACHER),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('keyword')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PaginationDto, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT, role_enum_1.Role.PARENT),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT, role_enum_1.Role.PARENT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage')),
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_logged_user_dto_1.UpdateLoggedUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLoggedUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER, role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map