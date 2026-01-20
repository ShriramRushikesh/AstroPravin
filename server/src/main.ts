import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
      origin: [
        'https://astropravin.com',
        'https://www.astropravin.com',
        'http://localhost:5173',
        'http://localhost:5002'
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api'); // Standardize all backend routes to /api/...

    // Serve static assets (uploads, kundlis)
    app.useStaticAssets(path.join(__dirname, '..', 'public'), {
      prefix: '/public',
    });

    const port = process.env.PORT || 5002;
    await app.listen(port);
    console.log(`🚀 NestJS Server running on port ${port} [v3-STRICT-CORS]`);
    console.log(`Allowed Origins: astropravin.com (and localhost)`);
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}
bootstrap();
