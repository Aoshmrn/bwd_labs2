"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ValidationError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.CustomError = CustomError;
class ValidationError extends CustomError {
    constructor(errors) {
        super('Ошибка валидации', 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomError {
    constructor(resource = 'Ресурс') {
        super(`${resource} не найден`, 404);
    }
}
exports.NotFoundError = NotFoundError;
