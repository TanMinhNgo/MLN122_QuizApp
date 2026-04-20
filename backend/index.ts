import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes';
import { errorHandler } from './src/middlewares/errorHandler';
import { notFound } from './src/middlewares/notFound';
import { ENV } from './src/config/env';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});

export default app;
