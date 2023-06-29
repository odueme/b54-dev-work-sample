import { Entity, OneToOne,ManyToOne, JoinColumn, Column, PrimaryGeneratedColumn } from 'typeorm'

import { ProductEntity } from 'src/product/product.entity'
import { Users } from 'src/auth/user.entity'

@Entity()
export class CartEntity {
   @PrimaryGeneratedColumn()
   id: number

   @Column()
   total: number

   @Column()
   quantity: number
  
   @ManyToOne(type => ProductEntity, item => item.id)
   @JoinColumn()
   item: ProductEntity

   @ManyToOne(type => Users, user => user.username)
   @JoinColumn()
   user: Users
}