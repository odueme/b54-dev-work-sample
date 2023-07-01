import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from './auth/user.entity';
import { CartEntity } from './cart/cart.entity';
import { ProductEntity } from './product/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';






@Module({
  imports: [
    ProductModule, 
    AuthModule, 
    CartModule, 
   
    ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) =>({
    type: 'postgres',
    host: configService.get('DATABASE_URL '),
    port: +configService.get('DATABASE_URL '), 
    username: configService.get('DATABASE_URL '),
    password: configService.get('DATABASE_URL '),
    database: configService.get('DATABASE_URL '),
    entities: [CartEntity, Users, ProductEntity],
    synchronize: true,
  }),
  inject: [ConfigService]
  }),

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
