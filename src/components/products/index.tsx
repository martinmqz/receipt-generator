import type Product from '../../models/IProduct'
import { CheckboxCard, Stack } from '@chakra-ui/react'


interface ProductsProps {
  data: Product[];
  selectionChange?: (item: Product, checked: boolean) => void;
  selectedProducts?: Product[];
}

export default function Products({ data, selectionChange, selectedProducts }: Readonly<ProductsProps>) {
  return (
    <Stack>{
      data.map((item) => (
        <CheckboxCard.Root key={item.id}
          data-price={item.price}
          data-category={item.category}
          onChange={(e) => selectionChange?.(item, (e.target as HTMLInputElement).checked)}
          defaultChecked={selectedProducts?.find((product) => product.id === item.id) !== undefined}
        >
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control>
            <CheckboxCard.Content>
              <CheckboxCard.Label className="product">{item.name}</CheckboxCard.Label>
              <CheckboxCard.Description>
                {item.id} | {item.category} | ${item.price.toFixed(2)}
              </CheckboxCard.Description>
            </CheckboxCard.Content>
            <CheckboxCard.Indicator />
          </CheckboxCard.Control>
        </CheckboxCard.Root>
      ))
    }
    </Stack>
  )
}
