import { 
    Entity, 
    OneToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn, 
    OneToMany,
     Column
} 
    from 'typeorm' 
    import {
        CartEntity
    } 
    from 'src/cart/cart.entity'

 
    @Entity()
    export class Users{
        @PrimaryGeneratedColumn()
        Id: number

        @Column()
        username: string

        @Column()
        password: string
     

        @Column()
        email: string

        @Column()
        phoneNumber: string

        @CreateDateColumn()
        createdAt : String
     
        @UpdateDateColumn()
        updtedAt : String
     
        @OneToMany(type => CartEntity, cart => cart.id)
        @JoinColumn()
        cart: CartEntity[]
     
    }
