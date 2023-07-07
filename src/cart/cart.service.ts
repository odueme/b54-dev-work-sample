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
  
    // Confirm the product exists.
    if (product) {
      const existingCartItem = cartItems.find(
        (item) => item.item.id === productId && item.user.username === user
      );
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.total = product.price * existingCartItem.quantity;
        return await this.cartRepository.save(existingCartItem);
      }
  
      const newItem = this.cartRepository.create({
        user: authUser,
        item: product,
        total: product.price * quantity,
        quantity: quantity,
        price: product.price, // Add this line to set the price property
      }  as DeepPartial<CartEntity>)
  
      return await this.cartRepository.save(newItem);
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
