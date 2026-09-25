export const IMPACT_METRICS = {
  totalMealsRescued: 14250,
  totalFoodDivertedLbs: 17800,
  co2eAvoidedKg: 32400,
  organizationsHelped: 48,
  completedDeliveries: 312,
  activeVolunteers: 85
};

export const CATEGORY_DISTRIBUTION = [
  { name: 'Prepared Meals', percentage: 38, lbs: 6764, color: '#16a34a' },
  { name: 'Bakery & Grains', percentage: 24, lbs: 4272, color: '#059669' },
  { name: 'Fruits & Vegetables', percentage: 20, lbs: 3560, color: '#0d9488' },
  { name: 'Packaged Goods', percentage: 12, lbs: 2136, color: '#2563eb' },
  { name: 'Dairy & Refrigerated', percentage: 6, lbs: 1068, color: '#7c3aed' }
];

export const ACTIVITY_TIMELINE = [
  { month: 'Apr', meals: 1850, co2e: 4200 },
  { month: 'May', meals: 2200, co2e: 4950 },
  { month: 'Jun', meals: 2750, co2e: 6200 },
  { month: 'Jul', meals: 3100, co2e: 7000 },
  { month: 'Aug', meals: 3850, co2e: 8800 },
  { month: 'Sep (MTD)', meals: 4250, co2e: 9650 }
];

export const RECENT_SUCCESSFUL_RESCUES = [
  {
    id: 'RESCUE-1001',
    food: '45 Roasted Chicken Bowls',
    donor: 'Green Leaf Bistro',
    recipient: 'Hope Community Shelter',
    divertedLbs: 52,
    co2eKg: 95,
    timestamp: '2 hours ago'
  },
  {
    id: 'RESCUE-1002',
    food: '30 lbs Fresh Sourdough Loaves',
    donor: 'Golden Crust Bakery',
    recipient: 'St. Vincent Dining Hall',
    divertedLbs: 30,
    co2eKg: 45,
    timestamp: '5 hours ago'
  },
  {
    id: 'RESCUE-1003',
    food: '50 Vegetable Lasagnas',
    donor: 'Bella Cucina Trattoria',
    recipient: 'City Mission Shelter',
    divertedLbs: 65,
    co2eKg: 120,
    timestamp: 'Yesterday'
  },
  {
    id: 'RESCUE-1004',
    food: '60 lbs Crisp Apples & Greens',
    donor: 'Valley Fresh Market',
    recipient: 'Westside Family Pantry',
    divertedLbs: 60,
    co2eKg: 82,
    timestamp: 'Yesterday'
  }
];
