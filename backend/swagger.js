const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API для управления мероприятиями и пользователями',
      version: '1.0.0',
      description: 'Документация для API мероприятий и пользователей',
      contact: {
        name: 'Shangin Arseny',
        email: 'mail@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:9090',
        description: 'Локальный сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Сообщение об ошибке'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Список ошибок'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Сообщение о статусе'
            },
            token: {
              type: 'string',
              description: 'JWT токен'
            }
          }
        },
        UserInput: {
          type: 'object',
          required: ['email', 'name', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            password: {
              type: 'string',
              format: 'password',
              example: '********'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            date: {
              type: 'string',
              format: 'date-time'
            },
            category: {
              type: 'string',
              enum: ['концерт', 'лекция', 'выставка']
            },
            createdBy: {
              type: 'integer'
            }
          }
        }
      },
      parameters: {
        roleParam: {
          in: 'header',
          name: 'role',
          schema: {
            type: 'string',
            enum: ['user', 'admin']
          },
          required: true,
          description: 'User role'
        }
      }
    },
    tags: [
      {
        name: 'Аутентификация',
        description: 'Регистрация и вход в систему'
      },
      {
        name: 'События',
        description: 'Управление событиями (требуется авторизация)'
      },
      {
        name: 'Пользователи',
        description: 'Управление пользователями (только для админов)'
      }
    ],
    security: {
      bearerAuth: []
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Custom Swagger UI configuration
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
    tagsSorter: 'alpha',
    defaultModelsExpandDepth: -1,
    docExpansion: 'list',
    operationsSorter: 'method'
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
};

module.exports = { 
  swaggerUi, 
  swaggerDocs,
  swaggerUiOptions 
};