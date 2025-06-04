import Cart from '../models/Cart'
import type Product from '../models/IProduct'

const Cache = {
  products: [] as Product[],
  cart: Cart
}

export default Cache
