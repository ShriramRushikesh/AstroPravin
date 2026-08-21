import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore fallback if custom DNS setting fails
}

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    process.stdout.write('⚡ Booting NestJS Application...\n');
    const { NestFactory } = require('@nestjs/core');
    const { AppModule } = require('./app.module');
    
    const app = await (NestFactory as any).create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // CORS Configuration (Dev + Prod)
    app.enableCors({
      origin: (origin: string, callback: any) => {
        // Allow all requests from localhost, local IP network, astropravin domains, or tools with no origin
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
    const publicPath = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    app.useStaticAssets(publicPath, {
      prefix: '/public',
    });

    const port = Number(process.env.PORT) || 5002;
    await app.listen(port, '0.0.0.0');
    process.stdout.write(`\n==================================================\n`);
    process.stdout.write(`🚀 BACKEND READY: http://localhost:${port}\n`);
    process.stdout.write(`🌐 FRONTEND READY: http://localhost:5173\n`);
    process.stdout.write(`💡 KEEP THIS TERMINAL OPEN (Do NOT press Ctrl+C)\n`);
    process.stdout.write(`==================================================\n\n`);
  } catch (error: any) {
    process.stderr.write(`❌ Server failed to start: ${error?.stack || error}\n`);
    process.exit(1);
  }
}
bootstrap();
