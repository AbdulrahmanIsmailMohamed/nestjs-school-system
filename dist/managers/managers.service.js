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
exports.ManagersService = void 0;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../users/entities/users.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hashPassword_1 = require("../utils/hashPassword");
const utils_1 = require("../utils");
let ManagersService = class ManagersService {
    constructor(userRepository, crypt, pagination) {
        this.userRepository = userRepository;
        this.crypt = crypt;
        this.pagination = pagination;
    }
    async createUser(createUserDto) {
        let { password, username } = createUserDto;
        if (!username || !password) {
            username = (0, utils_1.generateRandomCode)();
            password = (0, utils_1.generateRandomCode)();
        }
        const existingUser = await this.userRepository.findOneBy({ username });
        if (existingUser) {
            throw new common_1.BadRequestException('username already exists');
        }
        const hashPassword = this.crypt.hash(password);
        delete createUserDto.password;
        const user = await this.userRepository.save(this.userRepository.create({
            name: createUserDto.name,
            username,
            role: createUserDto.role,
            password: hashPassword,
        }));
        if (!user)
            throw new common_1.BadRequestException();
        return this.removeSensitiveUserFields(user);
    }
    async updateRoleOfUser(userId, role) {
        const user = await this.userRepository.update({ id: userId, confirm: true }, role);
        if (user.affected === 0)
            throw new common_1.NotFoundException();
        return 'Done';
    }
    async deleteUser(userId) {
        const user = await this.userRepository.delete({ id: userId });
        if (user.affected === 0)
            throw new common_1.NotFoundException();
        return 'done';
    }
    async getInactiveUsers(paginationDto, keyword, userId) {
        const paginationResult = await this.pagination.paginate(paginationDto, keyword, userId, false);
        if (!paginationResult.data)
            throw new common_1.BadRequestException(`Not found inactive users`);
        return paginationResult;
    }
    async getUnconfirmedUsers(paginationDto, keyword, userId) {
        const paginationResult = await this.pagination.paginate(paginationDto, keyword, userId, true, false);
        if (!paginationResult.data)
            throw new common_1.BadRequestException(`Not found Unconfirmed users`);
        return [paginationResult];
    }
    async inactiveOrActiveUser(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException();
        user.active ? (user.active = false) : (user.active = true);
        await user.save();
        return 'Done';
    }
    removeSensitiveUserFields(user) {
        const userSenitize = {
            id: user.id,
            username: user.username,
            email: user.email,
            country: user.country,
            city: user.city,
            profileImage: user.profileImage,
            profileImages: user.profileImages,
        };
        return userSenitize;
    }
};
exports.ManagersService = ManagersService;
exports.ManagersService = ManagersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        hashPassword_1.Crypt,
        utils_1.Pagination])
], ManagersService);
//# sourceMappingURL=managers.service.js.map