import type Product from '../models/IProduct'
import Config from './config'

/**
 * 
 * @returns A promise that resolves to an array of products.
 * @throws Will throw an error if the fetch operation fails or the response is not ok.
 */
export default async function fetchProducts() {
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