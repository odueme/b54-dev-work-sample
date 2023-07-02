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
    const arr = []
    arr.push(quantity)
    const sum = arr.reduce((acc, cur)=> {
      return acc + cur
    }, 0)
    const product = await this.productsService.getOne(productId);
    const authUser = await this.userRepository.findOneBy({ username: user });
    
    //Confirm the product exists.
    if (product) {
        client.messages.create({
          from: '+14177964331',
          to: `+234${authUser.phoneNumber}`,
          body: `Hello ${authUser.username} this is your order Name: ${product.name} price: ${product.price} quantity: ${quantity}` 
        })
      
        const user = authUser;
        const item = product;

        return await this.cartRepository.save({
          user: user,
          item: item,
          total: product.price * sum,
          quantity: sum,
        });
        
    
      //else {
         
      //   const total = cart[0].quantity * product.price
      //   client.messages.create({
      //     from: '+14177964331',
      //     to: '+23409023752601',
      //     body: `Hello ${authUser.username} this is your order Name: ${product.name} price: ${total} quantity: ${quantity}` 
      //   })

      //   return await this.cartRepository.update(cart[0].id, {
      //     quantity: cart[0].quantity += quantity,
      //     total: product.price * quantity,
      //   });
      // }
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
