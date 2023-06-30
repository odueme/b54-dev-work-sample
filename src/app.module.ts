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



@Module({
  imports: [
    ProductModule, 
    AuthModule, 
    CartModule, 
   
    
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306, 
    username: 'root',
    password: 'perfectman123@',
    database: 'userOrdersdb',
    entities: [CartEntity, Users, ProductEntity],
    synchronize: false,
  })
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
