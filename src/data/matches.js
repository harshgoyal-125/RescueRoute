export const DUMMY_MATCHES = [
  {
    id: 'MATCH-801',
    donationId: 'DON-101',
    donor: 'Green Leaf Bistro',
    recipient: 'Hope Community Shelter',
    foodType: 'Prepared Meals',
    foodName: 'Roasted Chicken & Quinoa Bowls',
    quantity: '45 meals',
    distance: '2.4 miles',
    expiry: 'Today, 7:30 PM (Urgent: < 3 hrs)',
    score: 96,
    capacityCompatibility: 'High (45 of 25 available capacity fits perfectly)',
    foodCompatibility: 'Direct Match (Prepared Meals priority)',
    urgency: 'High Urgency',
    reasons: [
      'Within preferred 8-mile radius (2.4 miles away)',
      'Quantity (45 meals) fits within current remaining capacity (25 meals gap planned for evening dinner)',
      'Prepared meals accepted by Hope Shelter kitchen staff',
      'High urgency: needs distribution before 8:00 PM evening service'
    ]
  },
  {
    id: 'MATCH-802',
    donationId: 'DON-102',
    donor: 'Golden Crust Bakery',
    recipient: 'Hope Community Shelter',
    foodType: 'Bakery',
    foodName: 'Artisan Sourdough & Baguettes',
    quantity: '30 lbs',
    distance: '3.8 miles',
    expiry: 'Today, 9:00 PM',
    score: 89,
    capacityCompatibility: 'Excellent (Bread racks available)',
    foodCompatibility: 'Direct Match (Bakery accepted)',
    urgency: 'Medium Urgency',
    reasons: [
      'Bread pantry has open storage rack capacity',
      'Donor is 3.8 miles away along standard downtown transit corridor',
      'Can be served as side during tomorrow breakfast distribution',
      'Bakery items have 24-hr shelf life extension with clean packaging'
    ]
  },
  {
    id: 'MATCH-803',
    donationId: 'DON-103',
    donor: 'Valley Fresh Market',
    recipient: 'Hope Community Shelter',
    foodType: 'Fruits & Vegetables',
    foodName: 'Organic Apples, Oranges & Kale',
    quantity: '60 lbs',
    distance: '5.1 miles',
    expiry: 'Tomorrow, 11:00 AM',
    score: 84,
    capacityCompatibility: 'Moderate (Walk-in cooler space required)',
    foodCompatibility: 'Direct Match (Fresh produce)',
    urgency: 'Moderate',
    reasons: [
      'Nutrient-dense fresh produce fits dietary enrichment goals',
      'Within 8-mile radius',
      'Requires cooler space (fits current walk-in availability)',
      'Flexible pickup window through tomorrow morning'
    ]
  },
  {
    id: 'MATCH-804',
    donationId: 'DON-106',
    donor: 'Apex Logistics Pantry',
    recipient: 'Hope Community Shelter',
    foodType: 'Packaged Food',
    foodName: 'High-Protein Grain Bars & Soups',
    quantity: '120 boxes',
    distance: '7.2 miles',
    expiry: 'In 4 days',
    score: 78,
    capacityCompatibility: 'Dry storage required',
    foodCompatibility: 'Accepted (Shelf stable)',
    urgency: 'Low Urgency',
    reasons: [
      'Non-perishable shelf-stable provisions',
      'Within maximum 8-mile radius',
      'High quantity provides multi-day pantry buffer',
      'Lower urgency allows flexible volunteer scheduling'
    ]
  }
];
