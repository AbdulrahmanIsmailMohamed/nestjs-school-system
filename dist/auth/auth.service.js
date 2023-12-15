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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const users_entity_1 = require("../users/entities/users.entity");
const utils_1 = require("../utils");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, crypt, mailerService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.crypt = crypt;
        this.mailerService = mailerService;
    }
    async register(registerDto) {
        const { password, email, username } = registerDto;
        const isEmailUserExist = await this.userRepository.findOneBy({
            email,
            confirm: true,
        });
        if (isEmailUserExist) {
            throw new common_1.BadRequestException(`The email ${email} is already in use. Please log in.`);
        }
        const user = await this.userRepository.findOneBy({ username });
        if (!user || !this.crypt.compare(password, user.password)) {
            throw new common_1.UnauthorizedException(`Invalid email or password`);
        }
        if (user.ban === false) {
            if (user.limit < 4) {
                this.updateUserData(user, registerDto);
                return await this.confirmEmail(user);
            }
            else {
                user.ban = true;
                user.banDate = (Date.now() + 1000 * 60 * 60 * 24).toString();
                user.limit = 0;
                await user.save();
                throw new common_1.BadRequestException(`Too much request please register after ${new Date(parseInt(user.banDate)).getHours()} hours`);
            }
        }
        else {
            if (parseInt(user.banDate) < Date.now()) {
                user.ban = false;
                user.banDate = undefined;
                await user.save();
                this.updateUserData(user, registerDto);
                return await this.confirmEmail(user);
            }
            else {
                throw new common_1.BadRequestException(`Too much request please register after ${new Date(parseInt(user.banDate)).getHours()} hours`);
            }
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOneBy({ email, confirm: true });
        if (!user || !this.crypt.compare(password, user.newPassword)) {
            throw new common_1.UnauthorizedException(`Invalid email or password`);
        }
        return await this.generateAccessToken(user);
    }
    async verifyEmailConfirmCode(emailConfirmCodeDto) {
        const { email, confirmCode } = emailConfirmCodeDto;
        const user = await this.userRepository.findOneBy({
            email,
            emailConfirmCode: this.hashCode(confirmCode),
            emailConfirmCodeExpire: (0, typeorm_2.MoreThan)(Date.now().toString()),
            confirm: false,
            active: true,
            ban: false,
        });
        if (!user)
            throw new common_1.BadRequestException(`Invalid email or confirm code`);
        user.confirm = true;
        user.emailConfirmCode = undefined;
        user.emailConfirmCodeExpire = undefined;
        await user.save();
        return `Your email confirmed successfully, now you can login`;
    }
    async confirmEmail(user) {
        const confirmCode = (0, utils_1.generateRandomCode)();
        user.emailConfirmCode = this.hashCode(confirmCode);
        user.emailConfirmCodeExpire = (Date.now() + 1000 * 60 * 10).toString();
        user.limit += 1;
        await user.save();
        const message = `
      <h2>Hi ${user.name}</h2>
      <p>We received a request to confirm the email on your school system Account.</p>
      <h3>${confirmCode}</h3>
      <p>Enter this code to complete the confirm</p>
      <p>Thanks for helping us keep your account secure</p>
      <p>The School System Team</p>
    `;
        try {
            await this.mailerService.sendMail({
                to: user.email,
                html: message,
                subject: 'Your Email Confirm Code (Valid For 10 Minutes)',
            });
        }
        catch (error) {
            await this.handleMailSendError(user);
        }
        return 'The confirmation code has been sent via email';
    }
    async handleMailSendError(user) {
        user.emailConfirmCode = undefined;
        user.emailConfirmCodeExpire = undefined;
        await user.save();
        throw new common_1.InternalServerErrorException('Failed to send confirmation email.');
    }
    async generateAccessToken(user) {
        const { id, username, role } = user;
        return this.jwtService.signAsync({
            id,
            username,
            role,
        });
    }
    updateUserData(user, registerDto) {
        const { email, newPassword, city, country } = registerDto;
        const hashNewPassword = this.crypt.hash(newPassword);
        user.email = email;
        user.newPassword = hashNewPassword;
        user.country = country;
        user.city = city;
    }
    hashCode(resetCode) {
        return (0, crypto_1.createHash)('sha256').update(resetCode).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        utils_1.Crypt,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map