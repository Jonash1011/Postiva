import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '').toLowerCase();
}

function getAllowedOrigins(): Set<string> {
  const configured = process.env.FRONTEND_URL || 'http://localhost:3000';
  return new Set(
    configured
      .split(',')
      .map((value) => normalizeOrigin(value))
      .filter(Boolean),
  );
}

function isAllowedOrigin(origin: string, allowedOrigins: Set<string>): boolean {
  const normalizedOrigin = normalizeOrigin(origin);

  if (
    /^http:\/\/localhost:\d+$/i.test(normalizedOrigin) ||
    /^https:\/\/localhost:\d+$/i.test(normalizedOrigin)
  ) {
    return true;
  }

  // Allow the production domain and preview deployments for this Vercel project.
  if (/^https:\/\/postiva-[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) {
    return true;
  }

  return allowedOrigins.has(normalizedOrigin);
}

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

  const allowedOrigins = getAllowedOrigins();

  // Enable CORS for frontend
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin, allowedOrigins)) {
        return callback(null, true);
      }

      // Deny CORS without surfacing as a server error.
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    optionsSuccessStatus: 204,
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
void bootstrap().catch((error) => {
  console.error('Failed to bootstrap application', error);
  process.exit(1);
});
