import { Entity, JoinColumn, OneToMany, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { CartEntity } from 'src/cart/cart.entity'

@Entity()
export class ProductEntity {
   @PrimaryGeneratedColumn()
   id: number

   @Column()
   name: string

   @Column()
   price: number
   
   @Column()
   quantity: string

   @Column()
   description: string

   @Column()
   img: string

   @CreateDateColumn()  
   createdAt: String

   @UpdateDateColumn()
   updtedAt: String

   @OneToMany(type => CartEntity, cart => cart.id)
   @JoinColumn()
   cart: CartEntity[]
}