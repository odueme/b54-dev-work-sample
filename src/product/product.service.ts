import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/user.entity';



@Injectable()
export class ProductService {
   constructor(@InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>) { }
  
   async getAll(): Promise<ProductEntity[]> {
       
       return await this.productRepository.find()
   }

   async create(product: ProductEntity, user: Users): Promise<any> {
           return await this.productRepository.save(product);
   }

   async getOne(id: number): Promise<any> {
       return this.productRepository.findOneBy({id});
   }

   async update(id: number, product: ProductEntity, user: Users): Promise<UpdateResult> {
    
           return await this.productRepository.update(id, product);
       
    
   }

   async delete(id: number, user: Users): Promise<DeleteResult> {
       
           return await this.productRepository.delete(id);
       
   }
  
}