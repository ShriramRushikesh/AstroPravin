import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

try {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5002',
      'https://astropravin.com',
      'https://www.astropravin.com',
      'https://astropravin.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Serve static assets (uploads, kundlis)
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  const port = process.env.PORT || 5002;
  await app.listen(port);
  console.log(`🚀 NestJS Server running on port ${port} [v2-CORS-FIX]`);
  console.log(`Allowed Origins: https://astropravin.com, https://astropravin.vercel.app`);
} catch (error) {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
}
}
bootstrap();
