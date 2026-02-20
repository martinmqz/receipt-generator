# Receipt Generator - Challenge
Web app in TypeScript bundled with Vite, and componetized with Chakra-ui.

## Specs
- Lists available products, fetched from API (local source: /api/items.json)
- Expected data is in the format:
  ```
  {
      "id": "017082112774",
      "name": "JK LNK BEEF TERI",
      "price": 5.99,
      "category": "g"
    }
  ```
- List items are selectable
- Selected items show in receipt section
- Search option returns items that contain the searched string in the name
- Receipt shows 
  - Subtotal
  - Tax amount
    - State tax rate: 6.3%
    - County tax rate: 0.7%
    - City tax rate: 2.0%
  - Total
- Items have a tax category
  - g (groceries)
  - pf (prepared food)
  - pd (prescription drug)
  - nd (non-prescription drug)
  - c (clothing)
  - o (other items)
- Sample data:
  ```
  017082112774,JK LNK BEEF TERI,5.99,g
  018200530470,BUD LT 12 CAN,11.99,o
  028400157827,CHEETOS CHED JAL,3.99,g
  028400589864,CHEETOS CRUNCHY,3.99,g
  080660956756,CORONA LT 12 BTL,12.99,o
  305730133203,ADVIL IBU 20CT,7.99,nd
  051000199447,CAMPBELL GO COCO,4.69,g
  051000058874,CAMPBELL HLTH TOM,2.49,g
  051000195654,CAMPBELL HOME SW,3.99,g
  305732450421,NEXIUM 24H ACID,8.99,nd
  305730184328,ADVIL COLD SINUS,6.99,nd
  305730179201,ADVIL JR IBUPROF,4.99,nd
  ```

## Getting the app started
```
npm i
npm run dev
```

## DEMO
[https://martinmqz.github.io/receipt-generator](https://martinmqz.github.io/receipt-generator/?github)
![image](https://github.com/user-attachments/assets/7c29b7db-78c5-48af-9184-89b672390dec)

![image](https://api.webect.com/px?r=receipt-generator)

