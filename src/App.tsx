import React from 'react'
import Products from './components/products'
import type Product from './models/IProduct'
import { EmptyState, VStack, ProgressCircle, Input, InputGroup, CloseButton, HStack, Button } from '@chakra-ui/react'
import { Chart, useChart } from '@chakra-ui/charts'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { LuShoppingCart, LuPrinter } from 'react-icons/lu'
import Config from './utils/config'
import Cart from './models/Cart'
import Cache from './utils/cache'
import viteLogo from '/vite.svg'
import './styles/App.css'
import './styles/print.css'

function App() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [products, setProducts] = React.useState<Product[]>(Cache.products)
  const [cartItems, setCartItems] = React.useState<Product[]>([])
  const [searchKeyword, setSearchKeyword] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const endElement = searchKeyword ? (
    <CloseButton
      onClick={() => {
        setSearchKeyword('')
        inputRef.current?.focus()
      }}
    />
  ) : undefined
  
  const chart = useChart<{ quantity: number; category: string }>({
      data: getChartData(cartItems)
    })

  React.useEffect(() => {
    fetchProducts()
      .then((data) => {
        Cache.products = data
        setProducts(Cache.products)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    if (searchKeyword) {
      const filteredProducts = Cache.products.filter(product =>
        product.name.toUpperCase().includes(searchKeyword.toUpperCase())
      )
      setProducts(filteredProducts)
    } 
    else {
      setProducts(Cache.products)
    }
  }, [searchKeyword])

  return (
    <>
      <header>
        <img src={viteLogo} alt="Vite logo" />
        Store Sales Receipt Generator
      </header>
      <main>
        <section id="items-section">
          <InputGroup endElement={endElement}>
            <Input
              ref={inputRef}
              placeholder="Search products"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.currentTarget.value)
              }}
            />
          </InputGroup>
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
            <Products data={products} selectionChange={updateItemInCart} selectedProducts={cartItems} />
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
                  <EmptyState.Title>Your receipt is empty</EmptyState.Title>
                  <EmptyState.Description>
                    Explore our products and add items to your receipt
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          )}
          <div className="cart">
            <div className="cart-items">{renderCartItems(cartItems)}</div>
            <div className="cart-summary">{cartItems.length > 0 && renderCartSummary(cartItems)}</div>
            { cartItems.length > 0 && (
            <HStack>
              <Button className='print-button' onClick={() => window.print()}>
                <LuPrinter />
                Print Receipt
              </Button>
            </HStack>
            )}
            { cartItems.length > 0 && (
            <Chart.Root maxH="sm" chart={chart} className="chart-container">
              <BarChart data={chart.data}>
                <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
                <XAxis axisLine={false} tickLine={false} dataKey={chart.key('category')} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  // domain={[0, 10]}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar isAnimationActive={true} dataKey={chart.key('quantity')}>
                  {chart.data.map((item) => (
                    <Cell key={item.category} fill={chart.color(item.color)} />
                  ))}
                </Bar>
              </BarChart>
            </Chart.Root>
            )}

          </div>
        </section>
      </main>
      <footer id="footer">[FOOTER]</footer>
    </>
  )

  /**
   * Handles adding or removing a product from the cart
   * @param product The product being added or removed.
   * @param wasAdded True if the product was selected, false if it was unselected.
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

function countItemsByCategory(products: Product[], category: string): number {
  return products.filter(product => product.category === category).length
}

function getChartData(items: Product[]) {
  return  [
    { quantity: countItemsByCategory(items, 'g'), category: 'Grocery', color: 'red.solid' },
    { quantity: countItemsByCategory(items, 'pf'), category: 'Prep. food', color: 'blue.solid' },
    { quantity: countItemsByCategory(items, 'pd'), category: 'Presc. drug', color: 'green.solid' },
    { quantity: countItemsByCategory(items, 'nd'), category: 'NP drug', color: 'yellow.solid' },
    { quantity: countItemsByCategory(items, 'c'), category: 'Clothing', color: 'teal.solid' },
    { quantity: countItemsByCategory(items, 'o'), category: 'Other', color: 'purple.solid' }
  ]
}

export default App
