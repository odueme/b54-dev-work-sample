import { User } from "./user.entity";
import {CartEntity} from './cart/cart.entity'
import {PorductEntity} from './product/product.entity'

const entities = [User, CartEntity, PorductEntity];

export {User, CartEntity, PorductEntity};
export default entities;