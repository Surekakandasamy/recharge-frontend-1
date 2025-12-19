export const plans = [
  { id: 1, operator: 'Airtel', price: 199, data: '1.5GB/day', validity: 28, category: 'Unlimited' },
  { id: 2, operator: 'Jio', price: 249, data: '2GB/day', validity: 28, category: 'Unlimited' },
  { id: 3, operator: 'Vi', price: 299, data: '1.5GB/day', validity: 28, category: 'Data' },
  { id: 4, operator: 'BSNL', price: 99, data: '1GB/day', validity: 18, category: 'Talktime' }
];

export const offers = [
  { id: 1, title: '20% Off', code: 'SAVE20', discount: 20, type: 'percentage', minAmount: 100 },
  { id: 2, title: 'Flat ₹50 Off', code: 'FLAT50', discount: 50, type: 'flat', minAmount: 200 }
];

export const operators = ['Airtel', 'Jio', 'Vi', 'BSNL'];