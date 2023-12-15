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
exports.Pagination = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/entities/users.entity");
const typeorm_2 = require("typeorm");
let Pagination = class Pagination {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async paginate(paginationDto, keyword, userId, active = true, confirm = true) {
        const { limit, page } = paginationDto;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        const filters = {
            id: (0, typeorm_2.Not)(userId),
            active,
            role: (0, typeorm_2.Not)('manager'),
            confirm,
        };
        const query = this.userRepository.createQueryBuilder('user');
        if (keyword) {
            query.andWhere('(user.username LIKE :keyword OR user.name LIKE :keyword)', { keyword: `%${keyword}%` });
        }
        const users = await query
            .andWhere(filters)
            .skip(skip)
            .take(limit)
            .select([
            'user.id',
            'user.username',
            'user.name',
            'user.email',
            'user.country',
            'user.city',
            'user.profileImage',
            'user.profileImages',
        ])
            .getMany();
        if (!users)
            throw new common_1.NotFoundException();
        const countDocument = await query
            .andWhere(filters)
            .skip(skip)
            .take(limit)
            .select([
            'user.id',
            'user.username',
            'user.name',
            'user.email',
            'user.country',
            'user.city',
            'user.profileImage',
            'user.profileImages',
        ])
            .getCount();
        const paginationResult = {
            data: users,
            page,
            limit,
            countDocument,
        };
        if (endIndex < countDocument)
            paginationResult.nextPage = page + 1;
        if (skip > 0)
            paginationResult.previousPage = page - 1;
        return paginationResult;
    }
};
exports.Pagination = Pagination;
exports.Pagination = Pagination = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], Pagination);
//# sourceMappingURL=pagination.util.js.map