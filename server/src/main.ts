console.log('\n[1/3] ⚡ Loading AstroPravin Server Modules...');

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('[2/3] 🔌 Initializing NestJS & Database Connection...');

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // CORS Configuration (Dev + Prod)
    app.enableCors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (
          !origin ||
          /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin) ||
          origin.includes('astropravin.com')
        ) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    });

    // Global pipes & validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    app.setGlobalPrefix('api'); // Standardize all backend routes to /api/...

    // Serve static assets (uploads, kundlis)
    const publicPath = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicPath, 'uploads');
    const kundlisDir = path.join(publicPath, 'kundlis');
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(kundlisDir)) fs.mkdirSync(kundlisDir, { recursive: true });

    app.useStaticAssets(publicPath, {
      prefix: '/public',
    });
    app.useStaticAssets(uploadsDir, {
      prefix: '/uploads',
    });


    const port = Number(process.env.PORT) || 5002;
    await app.listen(port, '0.0.0.0');
    console.log(`\n==================================================`);
    console.log(`[3/3] 🚀 BACKEND READY: http://localhost:${port}/api`);
    console.log(`🌐 FRONTEND READY: http://localhost:5173`);
    console.log(`💡 KEEP THIS TERMINAL OPEN (Do NOT press Ctrl+C)`);
    console.log(`👉 Open http://localhost:5173/matrimony in your browser!`);
    console.log(`==================================================\n`);
  } catch (error: any) {
    console.error(`❌ Server failed to start: ${error?.stack || error}`);
    process.exit(1);
  }
}
bootstrap();
