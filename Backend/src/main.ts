import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Allow large bodies for base64 image payloads (~5MB image → ~7MB base64)
    bodyParser: true,
  });

  // Increase JSON body size limit to handle base64 image strings
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global prefix so all routes are under /api
  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow any localhost port in development
      if (origin.match(/^http:\/\/localhost:\d+$/)) {
        return callback(null, true);
      }
      // Allow configured frontend URL(s)
      // Supports comma-separated list in FRONTEND_URL (e.g. "https://a.com,https://www.a.com")
      const allowedRaw = process.env.FRONTEND_URL || 'http://localhost:3000';
      const allowedOrigins = allowedRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3001);
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}/api`);
}
bootstrap();
