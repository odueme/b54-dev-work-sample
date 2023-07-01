import { Entity, JoinColumn, OneToMany, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { CartEntity } from 'src/cart/cart.entity'

@Entity()
export class ProductEntity {
   @PrimaryGeneratedColumn({
      type: 'bigint',
      name: 'user_id'
  })
   id: number

   @Column({
      nullable: false,
      default: ''
  })
   name: string

   @Column({
      nullable: false,
      default: ''
  })
   price: number
   
   @Column({
      nullable: false,
      default: ''
  })
   quantity: string

   @Column({
      nullable: false,
      default: ''
  })
   description: string

   @Column({
      nullable: false,
      default: ''
  })
   img: string

   @CreateDateColumn()  
   createdAt: String

   @UpdateDateColumn()
   updtedAt: String

   @OneToMany(type => CartEntity, cart => cart.id)
   @JoinColumn()
   cart: CartEntity[]
}