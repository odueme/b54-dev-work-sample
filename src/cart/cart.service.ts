import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { ProductService } from 'src/product/product.service';
import { Users } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';



const nodemailer = require('nodemailer')


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
   

    let arr = []
    
    userCart.filter((item, index) =>{
      if(item.user.username === user){
       
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "uodueme@gmail.com",
          pass: "rcnbvkjsujncjuhs"
        }
       })
  
       const options = {
        from: "uodueme@gmail.com",
        to: "odueme2082@student.babcock.edu.ng",
        subject: "sending email with node",
        text: `Hello ${item.user.username} you ordered is ${item[index].item.name} ${item[index].item.price} ${item[index].item.description}`
       }
  
       transporter.sendMail(options, (err, info) =>{
        if(err){
          console.log(err)
          return
        }
        console.log(info.res)
  
       })       
      }
    })

 
    
    return (await userCart).filter((item) => item.user.username === user);
  }
}
