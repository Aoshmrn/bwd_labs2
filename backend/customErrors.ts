export class CustomError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CustomError {
  errors: string[];

  constructor(errors: string[]) {
    super('Ошибка валидации', 400);
    this.errors = errors;
  }
}

export class NotFoundError extends CustomError {
  constructor(resource = 'Ресурс') {
    super(`${resource} не найден`, 404);
  }
}
