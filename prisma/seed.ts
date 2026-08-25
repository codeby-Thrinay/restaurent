import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DinePulse database with Food-101 Dataset items (₹)...');

  // Clean existing records
  await prisma.feedback.deleteMany();
  await prisma.waiterRequest.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();

  // 1. Seed Tables
  const tablesData = [
    { number: 1, capacity: 2, section: 'Main Dining', status: 'VACANT' },
    { number: 2, capacity: 4, section: 'Main Dining', status: 'OCCUPIED' },
    { number: 3, capacity: 4, section: 'Main Dining', status: 'VACANT' },
    { number: 4, capacity: 6, section: 'VIP Suite', status: 'VACANT' },
    { number: 5, capacity: 2, section: 'Patio', status: 'BILL_REQUESTED' },
    { number: 6, capacity: 4, section: 'Patio', status: 'VACANT' },
    { number: 7, capacity: 8, section: 'Banquet', status: 'VACANT' },
    { number: 8, capacity: 2, section: 'Bar Counter', status: 'NEEDS_CLEANING' },
    { number: 9, capacity: 4, section: 'Bar Counter', status: 'VACANT' },
    { number: 10, capacity: 6, section: 'Main Dining', status: 'VACANT' },
  ];

  for (const table of tablesData) {
    await prisma.table.create({ data: table });
  }

  // 2. Seed Categories
  const startersCat = await prisma.category.create({
    data: {
      name: 'Starters & Appetizers',
      description: 'Crispy starters, street food delicacies, and savory appetizers.',
      sortOrder: 1,
    },
  });

  const mainsCat = await prisma.category.create({
    data: {
      name: 'Chef Mains',
      description: 'Global and authentic signature main courses prepared fresh to order.',
      sortOrder: 2,
    },
  });

  const dessertsCat = await prisma.category.create({
    data: {
      name: 'Desserts & Sweets',
      description: 'Decadent desserts, sweet treats, artisanal ice creams, and pastries.',
      sortOrder: 3,
    },
  });

  const drinksCat = await prisma.category.create({
    data: {
      name: 'Beverages & Mocktails',
      description: 'Refreshing cold press juices, specialty coffees, and artisan mocktails.',
      sortOrder: 4,
    },
  });

  // Check if food101_dishes.json exists from download_food101.py script
  const jsonPath = path.resolve(process.cwd(), 'food101_dishes.json');
  let food101Dishes: any[] = [];

  if (fs.existsSync(jsonPath)) {
    console.log('Loading Food-101 metadata from food101_dishes.json...');
    food101Dishes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }

  // Complete Food-101 dataset classes with high resolution food imagery
  const defaultFood101Items = [
    // Starters & Appetizers
    {
      name: 'Crispy Samosa Plate',
      description: 'Traditional spiced potato and green pea turnover pastry served with mint & tamarind chutney.',
      price: 180.0,
      isVeg: true,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Steamed Pork / Veg Gyoza',
      description: 'Pan-fried Japanese dumplings stuffed with seasoned vegetables and aromatic ginger soy dip.',
      price: 340.0,
      isVeg: true,
      spicyLevel: 1,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Golden Crispy Falafel Bites',
      description: 'Middle Eastern spiced chickpea patties served with creamy tahini sauce and warm pita.',
      price: 260.0,
      isVeg: true,
      spicyLevel: 1,
      image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Truffle Garlic Bread',
      description: 'Freshly baked baguette brushed with roasted garlic butter, rosemary, and melted mozzarella.',
      price: 220.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Loaded Nachos Supreme',
      description: 'Crispy corn tortilla chips piled high with melted cheese, jalapenos, salsa, and guacamole.',
      price: 280.0,
      isVeg: true,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Seasoned Peri Peri Fries',
      description: 'Golden crispy russet potato fries tossed in secret peri-peri spice blend.',
      price: 240.0,
      isVeg: true,
      spicyLevel: 1,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },

    // Chef Mains
    {
      name: 'Wood-Fired Margherita Pizza',
      description: 'San Marzano tomato sauce, fresh mozzarella di bufala, organic basil, and extra virgin olive oil.',
      price: 490.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Smokey Wagyu Smash Burger',
      description: 'Double beef patty, sharp cheddar, caramelized onions, smoked bacon jam, and truffle aioli on brioche.',
      price: 420.0,
      isVeg: false,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Authentic Thai Pad Thai',
      description: 'Stir-fried rice noodles with tamarind sauce, crushed peanuts, bean sprouts, and fresh lime.',
      price: 420.0,
      isVeg: true,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Japanese Tonkotsu Ramen',
      description: 'Rich pork broth ramen noodles topped with soft-boiled chashu egg, bamboo shoots, and scallions.',
      price: 390.0,
      isVeg: false,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Korean Bibimbap Rice Bowl',
      description: 'Warm white rice topped with sautéed vegetables, spicy chili paste, fried egg, and sliced beef.',
      price: 410.0,
      isVeg: false,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Street Style Tacos Al Pastor',
      description: 'Three warm corn tortillas filled with marinated grilled meat, cilantro, diced onions, and salsa verde.',
      price: 360.0,
      isVeg: false,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Classic Baked Lasagna Bolognese',
      description: 'Layers of pasta sheets, rich slow-cooked meat ragu, creamy béchamel sauce, and parmesan.',
      price: 450.0,
      isVeg: false,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },

    // Desserts
    {
      name: 'Classic Italian Tiramisu',
      description: 'Ladyfinger biscuits dipped in espresso coffee, layered with whipped mascarpone cheese and cocoa powder.',
      price: 320.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      categoryId: dessertsCat.id,
    },
    {
      name: 'Spanish Cinnamon Churros',
      description: 'Crispy golden fried dough pastries dusted in cinnamon sugar served with warm dark chocolate dip.',
      price: 230.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=600&q=80',
      categoryId: dessertsCat.id,
    },
    {
      name: 'New York Strawberry Cheesecake',
      description: 'Rich and creamy cheesecake on graham cracker crust drizzled with fresh strawberry reduction.',
      price: 310.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      categoryId: dessertsCat.id,
    },
    {
      name: 'Artisanal Ice Cream Sundae',
      description: 'Three scoops of Madagascar vanilla bean, dark chocolate, and pistachio gelato topped with hot fudge.',
      price: 210.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
      categoryId: dessertsCat.id,
    },

    // Drinks
    {
      name: 'Passionfruit Mango Sparkling Fizz',
      description: 'Sparkling mineral water infused with passionfruit puree, mango nectar, fresh mint, and lime.',
      price: 190.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      categoryId: drinksCat.id,
    },
    {
      name: 'Iced Vanilla Oat Milk Cold Brew',
      description: 'Slow-steeped artisan cold brew coffee layered with homemade vanilla syrup and cold oat foam.',
      price: 180.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
      categoryId: drinksCat.id,
    },
  ];

  // Insert items into database
  if (food101Dishes.length > 0) {
    console.log(`Seeding ${food101Dishes.length} Food-101 dataset items...`);
    for (const item of food101Dishes) {
      let catId = mainsCat.id;
      if (item.categoryName === 'Starters & Appetizers') catId = startersCat.id;
      else if (item.categoryName === 'Desserts & Sweets') catId = dessertsCat.id;

      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          isVeg: item.isVeg,
          spicyLevel: item.spicyLevel,
          image: item.image,
          categoryId: catId,
        },
      });
    }
  } else {
    console.log('Seeding Food-101 menu items...');
    for (const item of defaultFood101Items) {
      await prisma.menuItem.create({ data: item });
    }
  }

  // 4. Seed Sample Active Order for Table 2
  const table2 = await prisma.table.findUnique({ where: { number: 2 } });
  const burger = await prisma.menuItem.findFirst({ where: { name: { contains: 'Burger' } } });
  const fries = await prisma.menuItem.findFirst({ where: { name: { contains: 'Fries' } } });

  if (table2 && burger && fries) {
    const sampleOrder = await prisma.order.create({
      data: {
        tableId: table2.id,
        status: 'PREPARING',
        paymentStatus: 'UNPAID',
        totalAmount: burger.price + fries.price,
        notes: 'No onions on burger please',
        items: {
          create: [
            { menuItemId: burger.id, quantity: 1, price: burger.price, notes: 'No onions' },
            { menuItemId: fries.id, quantity: 1, price: fries.price },
          ],
        },
      },
    });

    console.log(`Created sample order ${sampleOrder.id} for Table 2`);
  }

  console.log('Food-101 seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
