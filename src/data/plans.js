const SAMPLE_PLANS = [
  // Airtel Plans
  {
    id: 1,
    name: "Unlimited Plan",
    operator: "Airtel",
    price: 299,
    data: "2GB/day",
    validity: "28",
    popular: true,
    category: "unlimited",
    benefits: "Unlimited Voice, 100 SMS/day, Free Roaming"
  },
  {
    id: 2,
    name: "Smart Recharge",
    operator: "Airtel",
    price: 199,
    data: "1.5GB/day",
    validity: "28",
    popular: true,
    category: "unlimited",
    benefits: "Unlimited Voice, 100 SMS/day, Free Roaming"
  },
  {
    id: 3,
    name: "Max Plan",
    operator: "Airtel",
    price: 499,
    data: "3GB/day",
    validity: "56",
    popular: false,
    category: "unlimited",
    benefits: "Unlimited Voice, 100 SMS/day, Disney+ Hotstar"
  },
  
  // Jio Plans
  {
    id: 4,
    name: "Data Booster",
    operator: "Jio",
    price: 98,
    data: "12GB",
    validity: "28",
    popular: false,
    category: "data",
    benefits: "Data Only, No Voice/SMS"
  },
  {
    id: 5,
    name: "Weekend Data",
    operator: "Jio",
    price: 58,
    data: "4GB",
    validity: "7",
    popular: false,
    category: "data",
    benefits: "Data Only, Weekend Special"
  },
  {
    id: 6,
    name: "Unlimited Plus",
    operator: "Jio",
    price: 349,
    data: "2.5GB/day",
    validity: "28",
    popular: true,
    category: "unlimited",
    benefits: "Unlimited Voice, 100 SMS/day, JioTV, JioCinema"
  },
  
  // Vi Plans
  {
    id: 7,
    name: "Quick Recharge",
    operator: "Vi",
    price: 99,
    data: "200MB",
    validity: "28",
    popular: false,
    category: "talktime",
    benefits: "₹75 Talktime, Local/STD Calls"
  },
  {
    id: 8,
    name: "Vi Hero Unlimited",
    operator: "Vi",
    price: 249,
    data: "1.5GB/day",
    validity: "28",
    popular: true,
    category: "unlimited",
    benefits: "Unlimited Voice, 100 SMS/day, Vi Movies & TV"
  },
  
  // BSNL Plans
  {
    id: 9,
    name: "Annual Plan",
    operator: "BSNL",
    price: 2999,
    data: "2.5GB/day",
    validity: "365",
    popular: false,
    category: "long-term",
    benefits: "Unlimited Voice, 100 SMS/day, Free Roaming"
  },
  {
    id: 10,
    name: "Budget Plan",
    operator: "BSNL",
    price: 187,
    data: "2GB/day",
    validity: "28",
    popular: false,
    category: "unlimited",
    benefits: "Unlimited Voice, 100 SMS/day"
  },
  
  // More Airtel Plans
  {
    id: 11,
    name: "Student Special",
    operator: "Airtel",
    price: 155,
    data: "1GB/day",
    validity: "24",
    popular: false,
    category: "special",
    benefits: "Unlimited Voice, 100 SMS/day, Educational Apps Free"
  },
  {
    id: 12,
    name: "International Roaming",
    operator: "Airtel",
    price: 2999,
    data: "5GB",
    validity: "30",
    popular: false,
    category: "international",
    benefits: "International Roaming, 100 Minutes International"
  }
];

export const OPERATORS = ['Airtel', 'Jio', 'Vi', 'BSNL'];

export default SAMPLE_PLANS;
