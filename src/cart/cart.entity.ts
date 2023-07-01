import { Entity, OneToOne,ManyToOne, JoinColumn, Column, PrimaryGeneratedColumn } from 'typeorm'

import { ProductEntity } from 'src/product/product.entity'
import { Users } from 'src/auth/user.entity'

@Entity()
export class CartEntity {
   @PrimaryGeneratedColumn({
      type: 'bigint',
      name: 'user_id'
  })
   id: number

   @Column({
      nullable: false,
   
  })
   total: number

   @Column({
      nullable: false,
   
  })
   quantity: number
  
   @ManyToOne(type => ProductEntity, item => item.id)
   @JoinColumn()
   item: ProductEntity

   @ManyToOne(type => Users, user => user.username)
   @JoinColumn()
   user: Users
}