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
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              format: 'password'
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
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };