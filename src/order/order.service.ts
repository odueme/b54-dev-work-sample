import { Injectable } from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from 'src/cart/cart.service';
import { Users } from 'src/auth/user.entity';

const nodemailer = require('nodemailer')
@Injectable()
export class OrderService {
   constructor(@InjectRepository(OrderEntity)
   private orderRepository: Repository<OrderEntity>,
       @InjectRepository(Users)
       private userRepository: Repository<Users>,
       private cartService: CartService) {}

       async order(user: string): Promise<any> {
    
        const usersOrder = await this.orderRepository.find({ relations: ['user'] });
        const userOrder = usersOrder.filter(order => order.user?.username === user && order.pending === false);
    
        const cartItems = await this.cartService.getItemsInCard(user)
        const subTotal = cartItems.map(item => item.total).reduce((acc, next) => acc + next);
        
        const authUser = await this.userRepository.findOneBy({ username: user })
    
        const cart = await cartItems.map(item => item.item);
 
        if (userOrder.length === 0) {
            const newOrder = await this.orderRepository.create({ subTotal });
            newOrder.items = cart
            newOrder.user = authUser;

            cart.map(item => {
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'uodueme@gmail.com',
                  pass: 'rcnbvkjsujncjuhs'
                }
              });
              
              const mailOptions = {
                from: 'uodueme@gmail.com',
                to: `${newOrder.user.email}`,
                subject: 'Subject',
                text: `Hello ${newOrder.user.username} this is your order: Name:${item.name} price:${item.price}
                description:${item.description} you ordered: ${cartItems.map(item =>{
                  return item.quantity })} of this item and your total is:${newOrder.subTotal}`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
               console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  
                }
              });
            })
           
            return await this.orderRepository.save(newOrder);
 
 
        } else { 
            const existingOrder = userOrder.map(item => item)
            await this.orderRepository.update(existingOrder[0].id, { subTotal: existingOrder[0].subTotal + cart[0].price });
            return { message: "order modified" }
        }
    }

    async getOrders(user: string): Promise<OrderEntity[]> {
        const orders = await this.orderRepository.find({ relations: ['user'] });
 
        
        return orders.filter(order => order.user?.username === user)
    }
 }