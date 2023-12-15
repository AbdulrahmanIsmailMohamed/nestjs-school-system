"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInt = void 0;
const class_transformer_1 = require("class-transformer");
const TransformInt = () => (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value);
exports.TransformInt = TransformInt;
//# sourceMappingURL=transform-int.decorator.js.map