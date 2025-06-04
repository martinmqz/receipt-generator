import type Product from '../models/IProduct'

/**
 * Counts the number of items in a given category from a list of products.
 * @param products 
 * @param category 
 * @returns 
 */
export default function countItemsByCategory(products: Product[], category: string): number {
  return products.filter(product => product.category === category).length
}
