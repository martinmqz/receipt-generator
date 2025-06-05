import React from 'react'
import Products from './components/products'
import type Product from './models/IProduct'
import { EmptyState, VStack, Input, InputGroup, CloseButton, HStack, Button, Skeleton, Text, Stack, IconButton, For } from '@chakra-ui/react'
import { Chart, useChart } from '@chakra-ui/charts'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { LuShoppingCart, LuPrinter, LuMoon, LuSun } from 'react-icons/lu'
import { useColorMode } from './components/ui/color-mode'
import Cache from './utils/cache'
import fetchProducts from './utils/fetch-products'
import renderCartItems from './utils/render-cart-items'
import renderCartSummary from './utils/render-cart-summary'
import getChartData from './utils/get-chart-data'
import './styles/App.css'
import './styles/print.css'

function App() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [products, setProducts] = React.useState<Product[]>(Cache.products)
  const [cartItems, setCartItems] = React.useState<Product[]>([])
  const [searchKeyword, setSearchKeyword] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const { toggleColorMode, colorMode } = useColorMode()
  const endElement = searchKeyword ? (
    <CloseButton
      onClick={() => {
        setSearchKeyword('')
        inputRef.current?.focus()
      }}
    />
  ) : undefined
  
  const chart = useChart<{ quantity: number; category: string, color: string }>({
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
        <img src='./vite.svg' alt="logo" width="50px" height="50px" />
        <h1>MM Receipt Generator</h1>
        <Text textStyle='xs' className='no-print'>Toggle Mode</Text>
        <IconButton onClick={toggleColorMode} variant="outline" size="sm" className='no-print' title='Toggle theme mode'>
          {colorMode === 'light' ? <LuSun /> : <LuMoon />}
        </IconButton>
      </header>
      <main>
        <section id="items-section" className='no-print'>
          <h2>Products</h2>
          <InputGroup endElement={endElement} className="search-input-container">
            <Input
              ref={inputRef}
              placeholder="Search products"
              value={searchKeyword}
              variant="subtle"
              onChange={(e) => {
                setSearchKeyword(e.currentTarget.value)
              }}
            />
          </InputGroup>
          {
            loading && !error && (
              <For each={[0,1,2,3,4,5,6,7,8,9,10,11]}>
                {(item: number) => (
                  <React.Fragment key={item}>
                    <HStack gap="5">
                      <Stack flex="1">
                        <Skeleton height="5" width="40%" />
                        <Skeleton height="5" width="80%"/>
                      </Stack>
                    </HStack>
                    <br />
                  </React.Fragment>
                )}
              </For>
          )}
          {
            !loading && !error &&
            <Products data={products} selectionChange={updateItemInCart} selectedProducts={cartItems} />
          }
          {error && (
            <VStack>
              <Text color="red.500">Error loading products. Please try again later</Text>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </VStack>
            /* Log error and send notification */
          )}
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
            <HStack className='no-print'>
              <Button className='print-button' onClick={() => window.print()}>
                <LuPrinter />
                Print Receipt
              </Button>
            </HStack>
            )}
            { cartItems.length > 0 && (
            <Chart.Root maxH="sm" chart={chart} className="chart-container no-print">
              <BarChart data={chart.data}>
                <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
                <XAxis axisLine={false} tickLine={false} dataKey={chart.key('category')} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
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
      <footer id="footer" className='no-print'>
        &copy;{(new Date).getFullYear()} MM Receipt Generator
      </footer>
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

  /**
   * Adds the product to the cart items array.
   * @param product The product to add to the cart.
   */
  function addItemToCart(product: Product) {
    cartItems.push(product)
  }

  /**
   * Removes the product from the cart items array. 
   * @param product The product to remove from the cart.
   */
  function removeItemFromCart(product: Product) {
    const index = cartItems.findIndex(item => item.id === product.id)
    if (index !== -1) {
      cartItems.splice(index, 1)
    }
  }
} // end App()






export default App
