import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sequelize from '@config/db';
import eventRoutes from '@routes/events';
import userRoutes from '@routes/users';
import authRoutes from '@routes/auth';
import publicRoutes from '@routes/public';
import errorHandler from '@routes/error';
import { swaggerUi, swaggerDocs, swaggerUiOptions } from '@/swagger';
import passport from '@config/passport';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('[ :method ] :url'));
app.use(passport.initialize());

const docs = express();
docs.use(express.json());
docs.use(cors());
docs.use(
  '/api-docs',
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded !== 'string') {
          req.user = decoded as { id: number; role: string };
        }
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions),
);

const PORT = process.env.PORT || 9090;

app.use('/', publicRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => console.log('Соединение с БД установлено.'))
  .catch((err) => console.error('Ошибка подключения к БД:', err));

sequelize
  .sync()
  .then(() => console.log('Модели синхронизированы с БД.'))
  .catch((err) => console.error('Ошибка синхронизации моделей:', err));

app
  .listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  })
  .on('error', (_err) => {
    if ((<any>_err).code === 'EADDRINUSE') {
      console.error(`Порт ${PORT} занят. Используйте другой`);
    } else {
      console.error('Ошибка при запуске сервера:', _err.message);
    }
  });

docs.listen(5000, () => {
  console.log(`Swagger UI доступен по адресу http://localhost:5000/api-docs`);
});
