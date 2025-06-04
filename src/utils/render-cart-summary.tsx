import Cart from '../models/Cart'
import type Product from '../models/IProduct'

/**
 * 
 * @param cartItems An array of products representing items in the cart.
 * @returns A JSX element containing the cart summary, including subtotal, tax breakdown, and total amount due.
 */
export default function renderCartSummary(cartItems: Product[]) {
  const cart = new Cart(cartItems)
  const subtotal = cart.getSubtotal().toFixed(2)
  const taxTotals = cart.getTaxTotals()
  const stateTaxTotal = taxTotals.state.toFixed(2)
  const countyTaxTotal = taxTotals.county.toFixed(2)
  const cityTaxTotal = taxTotals.city.toFixed(2)
  const total = cart.getTotal().toFixed(2)

  return (
    <>
      <div className="cart-subtotal">
        <span>Subtotal: </span>
        <span>${subtotal}</span>
      </div>
      <div className="cart-taxes">
        <div className="cart-taxes__state">
          <span>State tax (6.3%): </span>
          <span>${stateTaxTotal}</span>
        </div>
        <div className="cart-taxes__county">
          <span>County tax (0.7%): </span>
          <span>${countyTaxTotal}</span>
        </div>
        <div className="cart-taxes__city">
          <span>City tax (2.0%): </span>
          <span>${cityTaxTotal}</span>
        </div>
      </div>
      <div className="cart-total">
        <span>Total due:</span>
        <span>${total}</span>
      </div>
    </>
  )
}
