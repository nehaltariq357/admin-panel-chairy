
export const cartItem = {
    name: 'cartItem',
    title: 'Cart Item',
    type: 'object',
    fields: [
      {
        name: 'product',
        title: 'Product',
        type: 'reference',
        to: [{ type: 'products' }], // Ensure this matches your product type
      },
      {
        name: 'quantity',
        title: 'Quantity',
        type: 'number',
      },
    ],
  };