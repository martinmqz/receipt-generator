import { describe, it, expect } from 'vitest'
import Cart from './Cart'

describe('Cart totals calculation - Test', () => {
    it('should return correct totals', () => {
        const taxRateState = 0.063 // Apply to all EXCEPT for g products
        const taxRateCounty = 0.007 // Apply to all EXCEPT for g products
        const taxRateCity = 0.02 // Applyes to ALL products
        
        const items = [
            { id: '1', name: 'Item 1', category: 'o', price: 10.00 },
            { id: '2', name: 'Item 2', category: 'nd', price: 20.00 },
            { id: '3', name: 'Item 3', category: 'c', price: 30.00 },
            { id: '4', name: 'Item 4', category: 'g', price: 40.999 },
            { id: '5', name: 'Item 5', category: 'g', price: 50.00 },
            { id: '6', name: 'Item 6', category: 'pd', price: 60.99 }
        ]

        const cart = new Cart(items)
        const subtotal = cart.getSubtotal()
        const taxTotals = cart.getTaxTotals()
        const totals = cart.getTotal()

        let taxTotal = (10*taxRateCity) + (10*taxRateCounty) + (10*taxRateState)
        taxTotal += (20*taxRateCity) + (20*taxRateCounty) + (20*taxRateState)
        taxTotal += (30*taxRateCity) + (30*taxRateCounty) + (30*taxRateState)
        taxTotal += (40.999*taxRateCity) // g products only pay city tax
        taxTotal += (50*taxRateCity) // g products only pay city tax
        taxTotal += (60.99*taxRateCity) + (60.99*taxRateCounty) + (60.99*taxRateState)
        
        expect(taxTotals.total).toBe(taxTotal)
        expect(subtotal).toBe(10+20+30+40.999+50+60.99) // 210.989
        expect(totals).toBe(subtotal + taxTotal) // 210.989 + taxTotal
        
    })
})