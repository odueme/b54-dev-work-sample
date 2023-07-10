import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { ProductService } from 'src/product/product.service';
import { Users } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';
import { DeepPartial } from 'typeorm';








@Injectable()
export class CartService {
  
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private productService: ProductService,
   

  ) {}

  async addToCart(productId: number, quantity: number, user: string): Promise<any> {
    const cartItems = await this.cartRepository.find({ relations: ['item', 'user'] });
    const product = await this.productService.getOne(productId);
    const authUser = await this.userRepository.findOneBy({ username: user });
  
    if (product) {
      const cart = cartItems.filter(
          (item) => item.item.id === productId && item.user.username === user,
      );
      if (cart.length < 1) {

          // const newItem = this.cartRepository.create({ total: product.price * quantity, quantity });
          // newItem.user = authUser;
          // newItem.item = product;
          return await  this.cartRepository.save({user: authUser, item: product, total: product.price * quantity, quantity: quantity })
           
      } else {
          const quantity = (cart[0].quantity += 1);
          const total = cart[0].total * quantity;

          return await this.cartRepository.update(cart[0].id, { quantity, total });
      }
    }
  
    return null;
  }
  

  async getItemsInCard(user: string): Promise<CartEntity[]> {
    const userCart = await this.cartRepository.find({
      relations: ['item', 'user'],
    });
    
    return (await userCart).filter((item) => item.user.username === user);
  }
}
