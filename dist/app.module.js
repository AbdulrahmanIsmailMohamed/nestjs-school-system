"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const postgres_module_1 = require("./postgres/postgres.module");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const guards_1 = require("./auth/guards");
const cloudinary_1 = require("cloudinary");
const managers_module_1 = require("./managers/managers.module");
const teachers_module_1 = require("./teachers/teachers.module");
const classes_module_1 = require("./classes/classes.module");
const students_module_1 = require("./students/students.module");
const dotenv = require("dotenv");
const mailer_1 = require("@nestjs-modules/mailer");
dotenv.config();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRoot({
                transport: `smtps://${process.env.MAILRE_USER}:${process.env.MAILRE_PASS}@${process.env.MAILRE_HOST}`,
                defaults: {
                    from: '"School System" <modules@nestjs.com>',
                },
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            postgres_module_1.PostgresModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            classes_module_1.ClassesModule,
            managers_module_1.ManagersModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.JwtAuthGuard,
            },
            {
                provide: 'Cloudinary',
                useFactory: () => cloudinary_1.v2.config({
                    cloud_name: process.env.CLOUDINARY_NAME,
                    api_key: process.env.CLOUDINARY_KEY,
                    api_secret: process.env.CLOUDINARY_SECRET,
                }),
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map