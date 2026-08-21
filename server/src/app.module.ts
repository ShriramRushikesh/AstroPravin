import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { KundliModule } from './kundli/kundli.module';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { MatrimonyModule } from './matrimony/matrimony.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '../.env', '../../.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = process.env.MONGODB_URI || configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI environment variable is not set. Check your .env file.');
        }
        process.stdout.write(`🔌 Mongoose connecting to target URI: ${uri.split('@')[1] || uri}\n`);
        return {
          uri,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          bufferCommands: false,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    process.stdout.write('✅ NestJS AppModule Initialized successfully!\n');
  }
}
