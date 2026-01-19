import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*', // Allow all origins (for mobile/LAN access)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Serve static assets (uploads, kundlis)
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  const port = process.env.PORT || 5002; // Default to 5002
  await app.listen(port);
  console.log(`🚀 NestJS Server running on port ${port}`);
}
bootstrap();
