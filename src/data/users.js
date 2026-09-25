export const DUMMY_USERS = [
  {
    id: 'user-donor-1',
    role: 'donor',
    name: 'Green Leaf Bistro',
    contactPerson: 'Chef Marcus Vance',
    email: 'marcus@greenleafbistro.com',
    phone: '(555) 234-5678',
    address: '142 Market Street, Downtown',
    avatar: '🥗'
  },
  {
    id: 'user-shelter-1',
    role: 'shelter',
    name: 'Hope Community Shelter',
    contactPerson: 'Elena Rostova',
    email: 'contact@hopeshelter.org',
    phone: '(555) 789-0123',
    address: '89 4th Avenue, Westside',
    avatar: '🏠',
    currentCapacity: 75,
    maxCapacity: 100,
    preferredRadiusMiles: 8,
    acceptedCategories: ['Prepared Meals', 'Bakery', 'Fruits & Vegetables', 'Dairy']
  },
  {
    id: 'user-driver-1',
    role: 'driver',
    name: 'Alex Rivera',
    email: 'alex.rivera@volunteer.org',
    phone: '(555) 456-7890',
    vehicle: 'Toyota RAV4 (Refrigerated Cooler Equipped)',
    avatar: '🚐',
    todayPickups: 3,
    completedTotal: 46,
    totalDistanceKm: 342
  },
  {
    id: 'user-admin-1',
    role: 'admin',
    name: 'Admin Coordinator',
    email: 'admin@rescueroute.org',
    phone: '(555) 000-1122',
    avatar: '📊'
  }
];

export const ROLE_DETAILS = {
  donor: {
    label: 'Food Donor',
    description: 'Restaurants, cafeterias, bakeries & grocers donating surplus food',
    defaultPath: '/donor'
  },
  shelter: {
    label: 'Shelter / Food Bank',
    description: 'Community shelters receiving verified meal donations',
    defaultPath: '/shelter'
  },
  driver: {
    label: 'Volunteer Driver',
    description: 'Logistics volunteers picking up and delivering food',
    defaultPath: '/driver'
  },
  admin: {
    label: 'Impact Coordinator',
    description: 'Platform management and city-wide diversion metrics',
    defaultPath: '/dashboard'
  }
};
