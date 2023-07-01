import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import{ProductModule} from './product/product.module'
import {AuthModule} from './auth/auth.module'
import {CartModule} from './cart/cart.module'
import {AppController} from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config';
import {AppService} from './app.service'


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    AuthModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
