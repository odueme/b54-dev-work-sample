import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { ProductService } from 'src/product/product.service';
import { Users } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';




@Injectable()
export class CartService {
  
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private productsService: ProductService,
    private configService: ConfigService,

  ) {}

  async addToCart(
    productId: number,
    quantity: number,
    user: string,
  ): Promise<any> {
    const cartItems = await this.cartRepository.find({
      relations: ['item', 'user'],
    });
    const { Vonage } = require('@vonage/server-sdk')
   

const vonage = new Vonage({
  apiKey: this.configService.get<string>('apiKey'),
  apiSecret: this.configService.get<string>('apiSecret')
})
  
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
        async function sendSMS() {
          await vonage.sms.send({to: `234${authUser.phoneNumber.substring(1)}`, from: "Vonage APIs", text: `Hello ${authUser.username}
          your order is Name:${product.name} decription: ${product.description} 
          total: ${product.price * existingCartItem.quantity}`})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      sendSMS();
        return await this.cartRepository.save(existingCartItem);
      }
  
      const newItem = this.cartRepository.create({
        user: authUser,
        item: product,
        total: product.price * quantity,
        quantity: quantity,
      });
      async function sendSMS() {
        await vonage.sms.send({to: `${authUser.phoneNumber}`, from: "Vonage APIs", text: `Hello ${authUser.username}
        your order is Name:${product.name} decription: ${product.decription} total: ${product.price * quantity}` })
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    sendSMS();
  
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
