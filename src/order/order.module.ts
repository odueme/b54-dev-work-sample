import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from 'src/product/product.entity';
import { CartService } from 'src/cart/cart.service';
import { CartEntity } from 'src/cart/cart.entity';
import { Users } from 'src/auth/user.entity';
import { ProductService } from 'src/product/product.service';
import {OrderController} from './order.controller'
import {OrderService} from './order.service'
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, ProductEntity, CartEntity, Users])],
    controllers: [OrderController],
    providers: [OrderService, CartService, ProductService, ConfigService],
   
   })

   export class OrderModule {}
