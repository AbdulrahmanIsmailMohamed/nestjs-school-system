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
exports.ManagersController = void 0;
const common_1 = require("@nestjs/common");
const managers_service_1 = require("./managers.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const decorators_1 = require("../auth/decorators");
const role_enum_1 = require("../common/enums/role.enum");
const guards_1 = require("../auth/guards");
const dto_1 = require("./dto");
const dtos_1 = require("../users/dtos");
let ManagersController = class ManagersController {
    constructor(managersService) {
        this.managersService = managersService;
    }
    createUser(createManagerDto) {
        return this.managersService.createUser(createManagerDto);
    }
    async getUnconfirmedUsers(paginationDto, keyword, req) {
        const data = await this.managersService.getUnconfirmedUsers(paginationDto, keyword, req.user.id);
        if (!data)
            throw new common_1.BadRequestException();
        return data;
    }
    async getInactiveUsers(paginationDto, keyword, req) {
        const data = await this.managersService.getInactiveUsers(paginationDto, keyword, req.user.id);
        if (!data)
            throw new common_1.BadRequestException();
        return data;
    }
    async deleteUser(id) {
        const user = await this.managersService.deleteUser(id);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
    async updateRoleOfUser(id, role) {
        const user = await this.managersService.updateRoleOfUser(id, role);
        if (!user)
            throw new common_1.NotFoundException();
        return user;
    }
    async inactiveOrActiveUser(id) {
        const user = await this.managersService.inactiveOrActiveUser(id);
        if (!user)
            throw new common_1.BadRequestException();
        return user;
    }
};
exports.ManagersController = ManagersController;
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], ManagersController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('/unconfirmed'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('keyword')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PaginationDto, String, Object]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "getUnconfirmedUsers", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('inactive'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('keyword')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PaginationDto, String, Object]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "getInactiveUsers", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateRoleOfUserDto]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "updateRoleOfUser", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, decorators_1.Roles)(role_enum_1.Role.MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Patch)('inactive/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManagersController.prototype, "inactiveOrActiveUser", null);
exports.ManagersController = ManagersController = __decorate([
    (0, common_1.Controller)('managers'),
    __metadata("design:paramtypes", [managers_service_1.ManagersService])
], ManagersController);
//# sourceMappingURL=managers.controller.js.map