import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DinePulse database...');

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
      description: 'Crispy, savory appetizers to kickstart your appetite.',
      sortOrder: 1,
    },
  });

  const mainsCat = await prisma.category.create({
    data: {
      name: 'Chef Mains',
      description: 'Handcrafted signature main courses prepared fresh to order.',
      sortOrder: 2,
    },
  });

  const dessertsCat = await prisma.category.create({
    data: {
      name: 'Desserts & Sweets',
      description: 'Decadent sweet treats, artisanal ice creams, and pastries.',
      sortOrder: 3,
    },
  });

  const drinksCat = await prisma.category.create({
    data: {
      name: 'Beverages & Mocktails',
      description: 'Refreshing cold press juices, specialty coffees, and mocktails.',
      sortOrder: 4,
    },
  });

  // 3. Seed Menu Items
  const menuItems = [
    // Starters
    {
      name: 'Truffle Parmesan Fries',
      description: 'Hand-cut russet fries tossed in black truffle oil, garlic herbs, and aged parmesan.',
      price: 9.5,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Fiery Crispy Wings',
      description: 'Jumbo chicken wings coated in hot buffalo honey sauce served with creamy blue cheese dip.',
      price: 13.9,
      isVeg: false,
      spicyLevel: 3,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Avocado Bruschetta',
      description: 'Grilled sourdough topped with smashed avocado, heirloom tomatoes, basil, and balsamic reduction.',
      price: 11.0,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },
    {
      name: 'Crispy Calamari',
      description: 'Flash-fried squid rings served with spicy garlic aioli and lemon wedges.',
      price: 14.5,
      isVeg: false,
      spicyLevel: 1,
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
      categoryId: startersCat.id,
    },

    // Mains
    {
      name: 'Wood-Fired Margherita Pizza',
      description: 'San Marzano tomato sauce, fresh mozzarella di bufala, organic basil, and extra virgin olive oil.',
      price: 16.5,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Smokey Wagyu Smash Burger',
      description: 'Double Wagyu beef patty, sharp cheddar, caramelized onions, smoked bacon jam, and truffle aioli on brioche.',
      price: 19.0,
      isVeg: false,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Creamy Garlic Butter Salmon',
      description: 'Pan-seared Atlantic salmon fillet served over spinach risotto and dill garlic butter sauce.',
      price: 24.5,
      isVeg: false,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },
    {
      name: 'Thai Spicy Green Curry',
      description: 'Fragrant coconut curry broth with fresh bamboo shoots, Thai basil, jasmine rice, and grilled tofu.',
      price: 17.5,
      isVeg: true,
      spicyLevel: 2,
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80',
      categoryId: mainsCat.id,
    },

    // Desserts
    {
      name: 'Molten Lava Chocolate Cake',
      description: 'Warm dark chocolate cake with a gooey molten center served with Madagascar vanilla bean gelato.',
      price: 9.5,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      categoryId: dessertsCat.id,
    },
    {
      name: 'Classic New York Cheesecake',
      description: 'Rich graham cracker crust cheesecake topped with fresh wild berry compote.',
      price: 8.5,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      categoryId: dessertsCat.id,
    },

    // Drinks
    {
      name: 'Passionfruit Mango Fizz',
      description: 'Sparkling mineral water infused with passionfruit puree, mango nectar, fresh mint, and lime.',
      price: 6.5,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      categoryId: drinksCat.id,
    },
    {
      name: 'Iced Vanilla Cold Brew Coffee',
      description: 'Slow-steeped artisan cold brew layered with homemade vanilla syrup and cold oat foam.',
      price: 5.5,
      isVeg: true,
      spicyLevel: 0,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
      categoryId: drinksCat.id,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  // 4. Seed Sample Active Order for Table 2
  const table2 = await prisma.table.findUnique({ where: { number: 2 } });
  const burger = await prisma.menuItem.findFirst({ where: { name: 'Smokey Wagyu Smash Burger' } });
  const fries = await prisma.menuItem.findFirst({ where: { name: 'Truffle Parmesan Fries' } });

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

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
