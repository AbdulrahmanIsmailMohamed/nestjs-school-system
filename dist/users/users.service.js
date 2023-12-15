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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./entities/users.entity");
const typeorm_2 = require("typeorm");
const cloudinary_1 = require("cloudinary");
const utils_1 = require("../utils");
let UsersService = class UsersService {
    constructor(userRepository, pagination) {
        this.userRepository = userRepository;
        this.pagination = pagination;
    }
    async getMe(userId) {
        console.log(userId);
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException(`${userId} not found`);
        }
        return this.removeSensitiveUserFields(user);
    }
    async getUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId, active: true, confirm: true },
            select: {
                id: true,
                username: true,
                email: true,
                country: true,
                city: true,
                profileImage: true,
                profileImages: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`${userId} not found`);
        }
        return user;
    }
    async getUsers(paginationDto, keyword, userId) {
        const proginationResult = await this.pagination.paginate(paginationDto, keyword, userId);
        if (!proginationResult)
            throw new common_1.NotFoundException();
        return proginationResult;
    }
    async updateLoggedUser(userId, updateLoggedUserDto, profileImage) {
        if (profileImage) {
            return await this.uploadProfileImage(userId, profileImage, updateLoggedUserDto);
        }
        const result = await this.userRepository.update({ id: userId }, updateLoggedUserDto);
        if (result.affected === 0) {
            throw new common_1.BadRequestException();
        }
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
    async uploadProfileImage(userId, profileImage, updateLoggedUserDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                country: true,
                city: true,
                profileImage: true,
                profileImages: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const { url } = await cloudinary_1.v2.uploader.upload(profileImage.path, {
            folder: 'school_system/profiles_Images',
            format: 'jpg',
            public_id: `${Date.now()}-profile`,
        });
        user.country = updateLoggedUserDto.country;
        user.city = updateLoggedUserDto.city;
        user.profileImage = url;
        user.profileImages = user.profileImages || [];
        user.profileImages.push(url);
        await user.save();
        return this.removeSensitiveUserFields(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        utils_1.Pagination])
], UsersService);
//# sourceMappingURL=users.service.js.map