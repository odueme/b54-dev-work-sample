import { Module } from '@nestjs/common';
import { CartEntity } from './cart.entity';
import { ProductService } from 'src/product/product.service';
import { ProductEntity } from 'src/product/product.entity';
import { Users } from 'src/auth/user.entity'
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CartEntity, ProductEntity, Users])],
 providers: [CartService, ProductService],
 controllers: [CartController],
})
export class CartModule {}
