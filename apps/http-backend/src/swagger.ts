import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X-Draw API',
      version: '1.0.0',
      description: 'API documentation for X-Draw collaborative drawing application',
      contact: {
        name: 'API Support',
        url: 'http://www.example.com/support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password (hashed)',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            photo: {
              type: 'string',
              description: 'User profile photo URL',
              nullable: true,
            },
          },
        },
        UserSignup: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            photo: {
              type: 'string',
              description: 'User profile photo URL',
              nullable: true,
            },
          },
        },
        UserSignin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        Room: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the room',
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 20,
              description: 'Room name',
            },
            slug: {
              type: 'string',
              description: 'Room URL slug (lowercase version of name)',
            },
            adminId: {
              type: 'integer',
              description: 'ID of the room admin/creator',
            },
          },
        },
        CreateRoom: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 20,
              description: 'Room name',
            },
          },
        },
        Chat: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the chat message',
            },
            roomId: {
              type: 'integer',
              description: 'ID of the room this chat belongs to',
            },
            message: {
              type: 'string',
              description: 'Chat message content',
            },
            userId: {
              type: 'integer',
              description: 'ID of the user who sent the message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the message was sent',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/*.ts'], // paths to files containing OpenAPI definitions
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
