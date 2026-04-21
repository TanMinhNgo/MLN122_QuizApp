import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { ENV } from './config/env';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middlewares/error.middleware';

const app = express();

// Bảo mật HTTP headers
app.use(helmet());

// CORS — cho phép frontend kết nối
app.use(
  cors({
    origin: 'https://mln-122-quiz-app.vercel.app',
    credentials: true,
  }),
);

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// HTTP request logging (chỉ bật trong môi trường development)
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', routes);

// Swagger UI — docs
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Kahoot Clone API Docs',
    swaggerOptions: { persistAuthorization: true },
  }),
);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server đang hoạt động.' });
});

// 404 Handler
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
