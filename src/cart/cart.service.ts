import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { ProductService } from 'src/product/product.service';
import { Users } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';




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
        return await this.cartRepository.save(existingCartItem);
      }
  
      
      const newItem = this.cartRepository.create({
        user: authUser,
        item: product,
        total: product.price * quantity,
        quantity: quantity,
      });
    
      return await this.cartRepository.save(newItem);
    }
  
    return null;
  }
  

  async getItemsInCard(user: string): Promise<CartEntity[]> {
    const userCart = await this.cartRepository.find({
      relations: ['item', 'user'],
    });
    const accountSid = this.configService.get<string>('accountSid')
  const authToken = this.configService.get<string>('authToken')
  
  
  const client = require('twilio')(accountSid, authToken);
    userCart.filter(item =>{
      if(item.user.username === user){
        const username = item.user.username
        const phone = item.user.phoneNumber

        client.messages.create({
          body: `Hello ${ username} your order is  Name : ${item.item.name} Item price : ${item.item.price} Item description:${item.item.description} Your total for this product : ${item.total}`,
          from: '+447446283439', 
          to: `+234${phone}`
            })
            .then((message) => console.log(`Message sent. SID: ${message.sid}`))
            .catch((error) => console.error(`Error sending message: ${error}`));
      }
     
    })
    
    return (await userCart).filter((item) => item.user.username === user);
  }
}
