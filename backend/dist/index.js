"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const events_1 = __importDefault(require("./routes/events"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const public_1 = __importDefault(require("./routes/public"));
const error_1 = __importDefault(require("./routes/error"));
const swagger_1 = require("./swagger");
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("./config/passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('[ :method ] :url'));
app.use(passport_1.default.initialize());
const docs = (0, express_1.default)();
docs.use(express_1.default.json());
docs.use((0, cors_1.default)());
docs.use('/api-docs', (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof decoded !== 'string') {
                req.user = decoded;
            }
        }
        catch (err) {
            console.error('Invalid token', err);
        }
    }
    next();
}, swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerDocs, swagger_1.swaggerUiOptions));
const PORT = process.env.PORT || 9090;
app.use('/', public_1.default);
app.use('/events', events_1.default);
app.use('/users', users_1.default);
app.use('/auth', auth_1.default);
app.use(error_1.default);
db_1.default
    .authenticate()
    .then(() => console.log('Соединение с БД установлено.'))
    .catch((err) => console.error('Ошибка подключения к БД:', err));
db_1.default
    .sync()
    .then(() => console.log('Модели синхронизированы с БД.'))
    .catch((err) => console.error('Ошибка синхронизации моделей:', err));
app
    .listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
})
    .on('error', (_err) => {
    if (_err.code === 'EADDRINUSE') {
        console.error(`Порт ${PORT} занят. Используйте другой`);
    }
    else {
        console.error('Ошибка при запуске сервера:', _err.message);
    }
});
docs.listen(5000, () => {
    console.log(`Swagger UI доступен по адресу http://localhost:5000/api-docs`);
});
