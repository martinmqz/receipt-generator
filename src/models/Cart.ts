import type Product from './IProduct'

/**
 * Cart model to manage items in a shopping cart.
 * It calculates subtotal, tax totals, and total amount due based on the items in the cart.
 */
export default class Cart {
  private items: Product[]
  private subtotal = 0
  private total = 0
  private readonly taxTotals = {
    state: 0,
    county: 0,
    city: 0,
    get total() {
      return this.state + this.county + this.city
    }
  }
  private readonly TAX_RATE_STATE = 0.063 // Apply to all EXCEPT for g products
  private readonly TAX_RATE_COUNTY = 0.007 // Apply to all EXCEPT for g products
  private readonly TAX_RATE_CITY = 0.02 // Applyes to ALL products
  
  constructor(items: Product[] = []) {
    this.items = items
  }

  addItem(item: Product) {
    this.items.push(item)
  }

  removeItem(itemId: string) {
    const item = this.items.find(item => item.id === itemId)
    if (item) {
      this.items = this.items.filter(item => item.id !== itemId)
    }
  }

  getCartItems() {
    return this.items
  }

  getSubtotal() {
    if (this.subtotal === 0) {      
      this.setTotals()
    }
    return this.subtotal
  }
  getTaxTotals() {
    if (this.taxTotals.total === 0) {
      this.setTotals()
    }
    return this.taxTotals
  }
  getTotal() {
    if (this.total === 0) {
      this.setTotals()
    }
    return this.total
  }
  
  private setTotals() {
    for(const item of this.items) {
      this.addItemToTotals(item)
    }
  }

 addItemToTotals(item: Product) {
    // Update tax totals
    this.taxTotals.city += item.price * this.TAX_RATE_CITY // Applies to all
    if (item.category !== 'g') {
      this.taxTotals.state += item.price * this.TAX_RATE_STATE
      this.taxTotals.county += item.price * this.TAX_RATE_COUNTY
    }
    // Update subtotal
    this.subtotal += item.price

    // Update total
    this.total = this.subtotal + this.taxTotals.total
  }
}
