import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { PetModule } from './pet/pet.module';
import { AdoptionModule } from './adoption/adoption.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PetModule,
    AdoptionModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
    ]),
  ],
  providers: [
    PostgresConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
