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
        @PrimaryGeneratedColumn({
            type: 'bigint',
            name: 'user_id'
        })
        Id: number

        @Column({
            nullable: false,
            default: ''
        })
        username: string

        @Column({
            nullable: false,
            default: ''
        })
        password: string
     

        @Column({
            nullable: false,
            default: ''
        })
        email: string

        @Column({
            nullable: false,
            default: ''
        })
        phoneNumber: string

        @CreateDateColumn()
        createdAt : String
     
        @UpdateDateColumn()
        updtedAt : String
     
        @OneToMany(type => CartEntity, cart => cart.id)
        @JoinColumn()
        cart: CartEntity[]
     
    }
