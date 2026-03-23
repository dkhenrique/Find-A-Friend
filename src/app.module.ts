import { Module } from '@nestjs/common';
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
  ],
  providers: [PostgresConfigService],
})
export class AppModule {}
