import type Product from '../models/IProduct'
import countItemsByCategory from './count-items-by-category'

/**
 * 
 * @param items An array of products.
 * @returns A formatted array of objects suitable for charting, each containing the quantity of items in a specific category, the category name, and a color code.
 */
export default function getChartData(items: Product[]) {
  return  [
    { quantity: countItemsByCategory(items, 'g'), category: 'Grocery', color: 'red.solid' },
    { quantity: countItemsByCategory(items, 'pf'), category: 'Prep. food', color: 'blue.solid' },
    { quantity: countItemsByCategory(items, 'pd'), category: 'Presc. drug', color: 'green.solid' },
    { quantity: countItemsByCategory(items, 'nd'), category: 'NP drug', color: 'yellow.solid' },
    { quantity: countItemsByCategory(items, 'c'), category: 'Clothing', color: 'teal.solid' },
    { quantity: countItemsByCategory(items, 'o'), category: 'Other', color: 'purple.solid' }
  ]
}
