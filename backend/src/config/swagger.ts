import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kahoot Clone API',
      version: '1.0.0',
      description:
        'REST API cho ứng dụng quiz realtime (Kahoot Clone). Xác thực bằng Bearer JWT token.',
    },
    servers: [
      {
        url: `http://localhost:${ENV.PORT}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Access token nhận được sau khi đăng nhập / đăng ký.',
        },
      },
      schemas: {
        // ─── Shared ────────────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Thành công.' },
            data: { description: 'Payload phản hồi' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Lỗi xảy ra.' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Dữ liệu không hợp lệ.' },
            errors: {
              type: 'object',
              additionalProperties: { type: 'string' },
              example: {
                email: 'Địa chỉ email không hợp lệ.',
                password: 'Mật khẩu phải có ít nhất 6 ký tự.',
              },
            },
          },
        },

        // ─── Auth ──────────────────────────────────────────────────
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            name: { type: 'string', example: 'Nguyễn Văn A' },
            email: {
              type: 'string',
              format: 'email',
              example: 'host@example.com',
            },
            role: { type: 'string', enum: ['host', 'admin'], example: 'host' },
          },
        },
        AuthData: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/UserProfile' },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        RegisterBody: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Nguyễn Văn A',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'host@example.com',
            },
            password: { type: 'string', minLength: 6, example: 'secret123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'host@example.com',
            },
            password: { type: 'string', example: 'secret123' },
          },
        },

        // ─── Quiz ──────────────────────────────────────────────────
        Option: {
          type: 'object',
          required: ['id', 'text', 'isCorrect', 'color'],
          properties: {
            id: { type: 'string', enum: ['A', 'B', 'C', 'D'], example: 'A' },
            text: { type: 'string', example: 'Hà Nội' },
            isCorrect: { type: 'boolean', example: true },
            color: { type: 'string', example: '#e21b3c' },
          },
        },
        Question: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0e' },
            quizId: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0f' },
            content: { type: 'string', example: 'Thủ đô của Việt Nam là?' },
            type: {
              type: 'string',
              enum: ['single', 'multiple', 'true_false'],
              example: 'single',
            },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/Option' },
            },
            timeLimit: {
              type: 'integer',
              enum: [5, 10, 20, 30, 60, 90, 120],
              example: 20,
            },
            points: { type: 'integer', enum: [1000, 2000], example: 1000 },
            imageUrl: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/img.jpg',
            },
            order: { type: 'integer', example: 0 },
          },
        },
        QuestionBody: {
          type: 'object',
          required: ['content', 'type', 'options'],
          properties: {
            content: { type: 'string', example: 'Thủ đô của Việt Nam là?' },
            type: {
              type: 'string',
              enum: ['single', 'multiple', 'true_false'],
              example: 'single',
            },
            options: {
              type: 'array',
              minItems: 2,
              items: { $ref: '#/components/schemas/Option' },
            },
            timeLimit: {
              type: 'integer',
              enum: [5, 10, 20, 30, 60, 90, 120],
              example: 20,
            },
            points: { type: 'integer', enum: [1000, 2000], example: 1000 },
            imageUrl: { type: 'string', nullable: true },
            order: { type: 'integer' },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0f' },
            hostId: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            title: { type: 'string', example: 'Địa lý Việt Nam' },
            description: {
              type: 'string',
              example: 'Quiz về địa danh nổi tiếng.',
            },
            thumbnail: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/thumb.jpg',
            },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Question' },
            },
            isPublic: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        QuizBody: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              example: 'Địa lý Việt Nam',
            },
            description: {
              type: 'string',
              maxLength: 500,
              example: 'Quiz về địa danh nổi tiếng.',
            },
            thumbnail: { type: 'string', format: 'uri', nullable: true },
            isPublic: { type: 'boolean', example: false },
          },
        },
        PaginatedQuizzes: {
          type: 'object',
          properties: {
            quizzes: {
              type: 'array',
              items: { $ref: '#/components/schemas/Quiz' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 25 },
                totalPages: { type: 'integer', example: 3 },
              },
            },
          },
        },
        ReorderBody: {
          type: 'object',
          required: ['orderedIds'],
          properties: {
            orderedIds: {
              type: 'array',
              items: { type: 'string' },
              example: ['id1', 'id2', 'id3'],
            },
          },
        },

        // ─── Session ───────────────────────────────────────────────
        SessionPlayer: {
          type: 'object',
          properties: {
            socketId: { type: 'string' },
            nickname: { type: 'string', example: 'QuizMaster99' },
            score: { type: 'integer', example: 2400 },
            streak: { type: 'integer', example: 3 },
            joinedAt: { type: 'string', format: 'date-time' },
          },
        },
        Session: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c10' },
            quizId: { type: 'string' },
            hostId: { type: 'string' },
            pin: { type: 'string', example: '482931' },
            status: {
              type: 'string',
              enum: [
                'waiting',
                'active',
                'question',
                'answer_reveal',
                'leaderboard',
                'ended',
              ],
              example: 'waiting',
            },
            currentQuestionIndex: { type: 'integer', example: -1 },
            players: {
              type: 'array',
              items: { $ref: '#/components/schemas/SessionPlayer' },
            },
            startedAt: { type: 'string', format: 'date-time', nullable: true },
            endedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        CreateSessionBody: {
          type: 'object',
          required: ['quizId'],
          properties: {
            quizId: {
              type: 'string',
              example: '664f1a2b3c4d5e6f7a8b9c0f',
            },
          },
        },
        CreateSessionData: {
          type: 'object',
          properties: {
            sessionId: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c10' },
            pin: { type: 'string', example: '482931' },
            qrCode: {
              type: 'string',
              description: 'Base64 PNG của QR code',
              example: 'data:image/png;base64,iVBORw0K...',
            },
          },
        },
        SessionResults: {
          type: 'object',
          properties: {
            session: { $ref: '#/components/schemas/Session' },
            rankings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  rank: { type: 'integer', example: 1 },
                  nickname: { type: 'string', example: 'QuizMaster99' },
                  score: { type: 'integer', example: 4800 },
                },
              },
            },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  playerSocketId: { type: 'string' },
                  nickname: { type: 'string' },
                  selectedOptions: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  isCorrect: { type: 'boolean' },
                  responseTime: {
                    type: 'integer',
                    description: 'Milliseconds',
                  },
                  pointsEarned: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
  },
  // Scan toàn bộ controllers và routes để đọc JSDoc annotations
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
