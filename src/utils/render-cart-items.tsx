import type Product from '../models/IProduct'

/**
 * 
 * @param cartItems An array of products representing items in the cart.
 * @returns JSX elements representing each cart item, including its name, ID, category, and price.
 */
export default function renderCartItems(cartItems: Product[]) {
  return cartItems.map((item) => (
    <div key={item.id} className="cart-item">
      <span className="cart-item__name">{item.name}</span>
      <span className='cart-item__id'>{item.id}</span>
      <span className='cart-item__category'>{item.category}</span>
      <span className="cart-item__price">${item.price.toFixed(2)}</span>
    </div>
  ))
}
