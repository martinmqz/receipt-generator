// import { Button, HStack } from '@chakra-ui/react'
import React from 'react'
import Products from './components/products'
import type Product from './models/IProduct'
import { EmptyState, VStack, ProgressCircle } from '@chakra-ui/react'
import { LuShoppingCart } from 'react-icons/lu'

import viteLogo from '/vite.svg'
import './App.css'
import Config from './utils/config'
import Cart from './models/Cart'
// import Cache from './utils/cache'

function App() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [products, setProducts] = React.useState<Product[]>([])
  const [cartItems, setCartItems] = React.useState<Product[]>([])

  React.useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setLoading(false)
      })
  }, [])

  return (
    <>
      <header>
        <img src={viteLogo} alt="Vite logo" />
        Store Sales Receipt Generator
      </header>
      <main>
        <section id="items-section">
          
          <h2>Products</h2>
          {
            loading && !error && 
            <ProgressCircle.Root value={null} size="xl" className="spinner">
              <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
              </ProgressCircle.Circle>
            </ProgressCircle.Root>
          }
          {
            !loading && !error &&
            <Products data={products} selectionChange={updateItemInCart} />
          }
        </section>
        <section id="receipt-section">
          <h2>Receipt</h2>
          { cartItems.length === 0 && (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <LuShoppingCart />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>Your cart is empty</EmptyState.Title>
                  <EmptyState.Description>
                    Explore our products and add items to your cart
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
          <div className="cart">
            <div className="cart-items">{renderCartItems(cartItems)}</div>
            <div className="cart-summary">{cartItems.length > 0 && renderCartSummary(cartItems)}</div>
          </div>
        </section>
      </main>
      <footer id="footer">[FOOTER]</footer>
    </>
  )

  /**
   * Handles adding or removing a product from the cart
   * @param product The product being added or removed.
   */
  function updateItemInCart(product: Product, wasAdded: boolean) {
    if (wasAdded) {
      addItemToCart(product)
    } else {
      removeItemFromCart(product)
    }
    setCartItems([...cartItems])
  }

  function addItemToCart(product: Product) {
    cartItems.push(product)
  }

  function removeItemFromCart(product: Product) {
    const index = cartItems.findIndex(item => item.id === product.id)
    if (index !== -1) {
      cartItems.splice(index, 1)
    }
  }
} // end App()


function renderCartItems(cartItems: Product[]) {
  return cartItems.map((item) => (
    <div key={item.id} className="cart-item">
      <span className="cart-item__name">{item.name}</span>
      <span className='cart-item__id'>{item.id}</span>
      <span className='cart-item__category'>{item.category}</span>
      <span className="cart-item__price">${item.price.toFixed(2)}</span>
    </div>
  ))
}

function renderCartSummary(cartItems: Product[]) {
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
        <span>Subtotal:</span>
        <span>${subtotal}</span>
      </div>
      <div className="cart-taxes">
        <div className="cart-taxes__state">
          <span>State tax (6.3%): {stateTaxTotal}</span>
        </div>
        <div className="cart-taxes__county">
          <span>County tax (0.7%): {countyTaxTotal}</span>
        </div>
        <div className="cart-taxes__city">
          <span>City tax (2.0%): {cityTaxTotal}</span>
        </div>
      </div>
      <div className="cart-total">
        <span>Total due:</span>
        <span>${total}</span>
      </div>
    </>
  )
}

async function fetchProducts() {
  try {
    const response = await fetch(Config.API_URL)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = (await response.json()) as Product[]
    return data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}

export default App
