import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Donation } from '../models/Donation.js';
import { Match } from '../models/Match.js';
import { Delivery } from '../models/Delivery.js';
import { FoodRequest } from '../models/FoodRequest.js';
import { generateMatchesForDonation } from '../services/matchingService.js';
import { ENV } from '../config/env.js';

async function seed() {
  if (ENV.NODE_ENV === 'production') {
    console.error('ERROR: Database seed script cannot run in production environment.');
    process.exit(1);
  }

  console.info('[Seed] Connecting to MongoDB...');
  await connectDB();

  console.info('[Seed] Clearing existing development records...');
  await Promise.all([
    User.deleteMany({}),
    Donation.deleteMany({}),
    Match.deleteMany({}),
    Delivery.deleteMany({}),
    FoodRequest.deleteMany({})
  ]);

  console.info('[Seed] Creating demo personas...');
  const passwordHash = await User.hashPassword('password123');

  // 1. Core Users
  const donorUser = await User.create({
    name: 'Green Leaf Bistro',
    email: 'marcus@greenleafbistro.com',
    passwordHash,
    role: 'DONOR',
    organizationName: 'Green Leaf Bistro',
    phone: '(555) 234-5678',
    address: '142 Market Street, Downtown',
    avatar: '🥗',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] }
  });

  const shelterUser = await User.create({
    name: 'Hope Community Shelter',
    email: 'contact@hopeshelter.org',
    passwordHash,
    role: 'SHELTER',
    organizationName: 'Hope Community Shelter',
    phone: '(555) 789-0123',
    address: '89 4th Avenue, Westside',
    avatar: '🏠',
    capacity: { current: 60, max: 100 },
    foodPreferences: ['Prepared Meals', 'Bakery', 'Fruits & Vegetables', 'Dairy'],
    preferredRadiusMiles: 15,
    isAvailable: true,
    location: { type: 'Point', coordinates: [-122.4150, 37.7780] }
  });

  const shelterUser2 = await User.create({
    name: 'Downtown Family Pantry',
    email: 'pantry@downtownfamily.org',
    passwordHash,
    role: 'SHELTER',
    organizationName: 'Downtown Family Pantry',
    phone: '(555) 345-6789',
    address: '220 Sutter Street, Downtown',
    avatar: '🍞',
    capacity: { current: 15, max: 50 },
    foodPreferences: ['Bakery', 'Packaged Food', 'Fruits & Vegetables', 'Dairy'],
    preferredRadiusMiles: 10,
    isAvailable: true,
    location: { type: 'Point', coordinates: [-122.4089, 37.7833] }
  });

  const shelterUser3 = await User.create({
    name: 'St. Jude Community Mission',
    email: 'intake@stjudemission.org',
    passwordHash,
    role: 'SHELTER',
    organizationName: 'St. Jude Community Mission',
    phone: '(555) 901-2345',
    address: '550 Mission Street, South of Market',
    avatar: '🍲',
    capacity: { current: 95, max: 150 },
    foodPreferences: ['Prepared Meals', 'Fruits & Vegetables', 'Other'],
    preferredRadiusMiles: 12,
    isAvailable: true,
    location: { type: 'Point', coordinates: [-122.4010, 37.7890] }
  });

  const driverUser = await User.create({
    name: 'Alex Rivera',
    email: 'alex.rivera@volunteer.org',
    passwordHash,
    role: 'DRIVER',
    phone: '(555) 456-7890',
    avatar: '🚐',
    driverDetails: {
      vehicle: 'Toyota RAV4 (Refrigerated Cooler Equipped)',
      activePickups: 3,
      completedDeliveries: 46,
      totalDistanceKm: 342.5
    }
  });

  const adminUser = await User.create({
    name: 'Admin Coordinator',
    email: 'admin@rescueroute.org',
    passwordHash,
    role: 'ADMIN',
    avatar: '📊'
  });

  console.info('[Seed] Creating initial donations...');
  const donations = await Donation.create([
    {
      donorId: donorUser._id,
      donorName: donorUser.name,
      foodType: 'Prepared Meals',
      foodName: 'Roasted Chicken & Quinoa Bowls',
      quantity: 45,
      unit: 'meals',
      pickupLocation: '142 Market Street, Back Entrance',
      availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      description: 'Freshly prepped boxed hot meals from corporate catering event. Sealed and temperature-controlled.',
      contactInfo: 'Marcus V. (555) 234-5678',
      status: 'DRIVER_ASSIGNED',
      matchedWith: shelterUser.name,
      matchedShelterId: shelterUser._id,
      driverAssigned: driverUser.name,
      driverId: driverUser._id
    },
    {
      donorId: donorUser._id,
      donorName: donorUser.name,
      foodType: 'Bakery',
      foodName: 'Artisan Sourdough & Baguettes',
      quantity: 30,
      unit: 'lbs',
      pickupLocation: '405 Pine Street, Front Counter',
      availableUntil: new Date(Date.now() + 6 * 60 * 60 * 1000),
      description: 'Surplus daily bake loaves. Packaged in sanitized food-grade paper bags.',
      contactInfo: 'Clara Oswald (555) 321-7654',
      status: 'MATCHED',
      matchedWith: shelterUser.name,
      matchedShelterId: shelterUser._id
    },
    {
      donorId: donorUser._id,
      donorName: donorUser.name,
      foodType: 'Fruits & Vegetables',
      foodName: 'Organic Apples, Oranges & Kale',
      quantity: 60,
      unit: 'lbs',
      pickupLocation: '1200 Commercial Way, Loading Bay 2',
      availableUntil: new Date(Date.now() + 18 * 60 * 60 * 1000),
      description: 'Slightly imperfect aesthetic produce, perfectly crisp and nutritious.',
      contactInfo: 'Dave Miller (555) 888-9900',
      status: 'POSTED'
    },
    {
      donorId: donorUser._id,
      donorName: donorUser.name,
      foodType: 'Dairy',
      foodName: 'Organic Whole Milk & Greek Yogurt',
      quantity: 25,
      unit: 'boxes',
      pickupLocation: '88 Dairy Way, Refrigerated Dock C',
      availableUntil: new Date(Date.now() + 5 * 60 * 60 * 1000),
      description: 'Refrigerated milk cartons and yogurts near sell-by date. Kept at 36°F constantly.',
      contactInfo: 'Sarah Jenkins (555) 654-3210',
      status: 'PICKED_UP',
      matchedWith: shelterUser.name,
      matchedShelterId: shelterUser._id,
      driverAssigned: driverUser.name,
      driverId: driverUser._id
    },
    {
      donorId: donorUser._id,
      donorName: donorUser.name,
      foodType: 'Prepared Meals',
      foodName: 'Vegetable Lasagna & Garlic Bread',
      quantity: 50,
      unit: 'meals',
      pickupLocation: '77 Broad Street, Kitchen Exit',
      availableUntil: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: 'Catering pans of warm vegetarian lasagna, packed in thermal safe containers.',
      contactInfo: 'Chef Antonio (555) 432-1098',
      status: 'DELIVERED',
      matchedWith: shelterUser.name,
      matchedShelterId: shelterUser._id,
      driverAssigned: driverUser.name,
      driverId: driverUser._id
    }
  ]);

  console.info('[Seed] Running deterministic matching algorithm...');
  for (const donation of donations) {
    if (donation.status === 'POSTED' || donation.status === 'MATCHED') {
      await generateMatchesForDonation(donation);
    }
  }

  console.info('[Seed] Creating initial deliveries...');
  await Delivery.create([
    {
      donationId: donations[0]._id,
      driverId: driverUser._id,
      driverName: driverUser.name,
      pickup: donations[0].donorName,
      pickupAddress: donations[0].pickupLocation,
      destination: shelterUser.name,
      destinationAddress: shelterUser.address,
      food: donations[0].foodName,
      quantity: `${donations[0].quantity} ${donations[0].unit}`,
      deadline: '6:30 PM',
      date: new Date().toISOString().split('T')[0],
      status: 'DRIVER_ASSIGNED',
      distanceKm: 3.8,
      donorContact: donations[0].contactInfo,
      recipientContact: `${shelterUser.name} ${shelterUser.phone}`,
      instructions: donations[0].description
    },
    {
      donationId: donations[3]._id,
      driverId: driverUser._id,
      driverName: driverUser.name,
      pickup: donations[3].donorName,
      pickupAddress: donations[3].pickupLocation,
      destination: shelterUser.name,
      destinationAddress: shelterUser.address,
      food: donations[3].foodName,
      quantity: `${donations[3].quantity} ${donations[3].unit}`,
      deadline: '5:00 PM',
      date: new Date().toISOString().split('T')[0],
      status: 'PICKED_UP',
      distanceKm: 6.2,
      donorContact: donations[3].contactInfo,
      recipientContact: `${shelterUser.name} ${shelterUser.phone}`,
      instructions: 'Keep crates upright.'
    },
    {
      donationId: donations[4]._id,
      driverId: driverUser._id,
      driverName: driverUser.name,
      pickup: donations[4].donorName,
      pickupAddress: donations[4].pickupLocation,
      destination: shelterUser.name,
      destinationAddress: shelterUser.address,
      food: donations[4].foodName,
      quantity: `${donations[4].quantity} ${donations[4].unit}`,
      deadline: '1:30 PM',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'DELIVERED',
      distanceKm: 4.1,
      donorContact: donations[4].contactInfo,
      recipientContact: `${shelterUser.name} ${shelterUser.phone}`,
      instructions: 'Delivered to dining staging area.'
    }
  ]);

  console.info('[Seed] Creating initial community food requests...');
  await FoodRequest.create([
    {
      recipientName: 'Tenderloin Youth & Family Center',
      organizationName: 'Tenderloin Community Programs',
      contactPhone: '(555) 712-4455',
      contactEmail: 'intake@tenderloinyouth.org',
      deliveryAddress: '201 Turk Street, Tenderloin, San Francisco, CA',
      location: { type: 'Point', coordinates: [-122.4140, 37.7831] },
      foodCategory: 'Prepared Meals',
      quantityNeeded: 35,
      unit: 'meals',
      urgency: 'HIGH',
      dietaryRestrictions: 'Nut-Free',
      notes: 'After-school meal program for local children and families.',
      status: 'PENDING'
    },
    {
      recipientName: 'Mission Senior Care Coalition',
      organizationName: 'Mission Senior Care',
      contactPhone: '(555) 823-9911',
      contactEmail: 'meals@missionseniorcare.org',
      deliveryAddress: '2588 Mission Street, Mission District, San Francisco, CA',
      location: { type: 'Point', coordinates: [-122.4190, 37.7550] },
      foodCategory: 'Fruits & Vegetables',
      quantityNeeded: 50,
      unit: 'lbs',
      urgency: 'MEDIUM',
      dietaryRestrictions: 'Low Sodium / Diabetic Friendly',
      notes: 'Weekly fresh produce distribution for homebound seniors.',
      status: 'APPROVED'
    }
  ]);

  console.info('[Seed] Successfully populated MongoDB development database!');
  console.info('Demo credentials (all passwords: password123):');
  console.info('  DONOR:   marcus@greenleafbistro.com');
  console.info('  SHELTER: contact@hopeshelter.org');
  console.info('  DRIVER:  alex.rivera@volunteer.org');
  console.info('  ADMIN:   admin@rescueroute.org');

  await disconnectDB();
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed Error]:', err.message);
  process.exit(1);
});
