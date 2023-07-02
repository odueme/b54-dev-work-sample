import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { ProductService } from 'src/product/product.service';
import { Users } from 'src/auth/user.entity';
const accountSid = 'AC75105157ee5d0bc3ce92eaa1d573d067'
const authToken = '15d0ebf5ad34a01c10efdcae68ad2425'
const client = require('twilio')(accountSid, authToken)
@Injectable()
export class CartService {
  
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private productsService: ProductService,
  ) {}

  async addToCart(
    productId: number,
    quantity: number,
    user: string,
  ): Promise<any> {
    const cartItems = await this.cartRepository.find({
      relations: ['item', 'user'],
    });
  
    const product = await this.productsService.getOne(productId);
    const authUser = await this.userRepository.findOneBy({ username: user });
  
    // Confirm the product and user exist.
    if (product && authUser) {
    
  
      const existingCartItem = cartItems.find(
        (item) =>
          item.item.id === productId && item.user.username === user
      );
   
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.total = product.price * existingCartItem.quantity;
        client.messages.create({
          from: '+14177964331',
          to: `+234${authUser.phoneNumber}`,
          body: `Hello ${authUser.username}, this is your order. Name: ${product.name}, price: ${product.price}, quantity: ${quantity}`,
        });
        return await this.cartRepository.save(existingCartItem);
      }
  
      const newItem = this.cartRepository.create({
        user: authUser,
        item: product,
        total: product.price * quantity,
        quantity: quantity,
      });
      client.messages.create({
        from: '+14177964331',
        to: `+234${authUser.phoneNumber}`,
        body: `Hello ${authUser.username}, this is your order. Name: ${product.name}, price: ${product.price}, quantity: ${quantity}`,
      });
  
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
