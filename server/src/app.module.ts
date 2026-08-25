import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { KundliModule } from './kundli/kundli.module';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { MatrimonyModule } from './matrimony/matrimony.module';
import { BlogsModule } from './blogs/blogs.module';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '../.env', '../../.env'],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 15, // max 15 req/sec
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 60, // max 60 req/10sec
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200, // max 200 req/min
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = process.env.MONGODB_URI || configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI environment variable is not set. Check your .env file.');
        }
        console.log(`🔌 Connecting to MongoDB Database...`);
        return {
          uri,
          serverSelectionTimeoutMS: 8000,
          connectTimeoutMS: 8000,
          autoIndex: false,
        };
      },
    }),
    AuthModule,
    BookingModule,
    KundliModule,
    SharedModule,
    ServicesModule,
    MatrimonyModule,
    BlogsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('✅ NestJS AppModule Initialized successfully with Rate Limiting Throttler!');
  }
}
