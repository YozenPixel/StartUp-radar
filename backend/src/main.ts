import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const port = configService.get<number>('PORT') || 3001;

  // Configuration CORS
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // Validation globale stricte des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtre global des exceptions Prisma
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Intercepteur global de journalisation HTTP
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Documentation interactive Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('StartupRadar API Gateway')
    .setDescription(
      'Documentation interactive des APIs de veille économique, scoring IA des opportunités et gestion des levées de fonds.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT généré via /auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'StartupRadar API Documentation',
  });

  await app.listen(port);
  console.log(`🚀 Backend NestJS démarré sur http://localhost:${port}`);
  console.log(`📑 Documentation Swagger disponible sur http://localhost:${port}/api/docs`);
}
bootstrap();
