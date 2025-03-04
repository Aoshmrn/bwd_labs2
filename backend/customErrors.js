class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class ValidationError extends CustomError {
    constructor(errors) {
        super('Ошибка валидации', 400);
        this.errors = errors;
    }
}

class NotFoundError extends CustomError {
    constructor(resource = 'Ресурс') {
        super(`${resource} не найден`, 404);
    }
}

module.exports = {
    CustomError,
    ValidationError,
    NotFoundError
};