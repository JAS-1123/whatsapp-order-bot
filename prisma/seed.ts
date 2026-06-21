import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Clean existing data to avoid duplicates/old products
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  const burgersCategory = await prisma.category.create({
    data: { name: '🍔 Burgers', description: 'Delicious handcrafted burgers' },
  });

  const pizzaCategory = await prisma.category.create({
    data: { name: '🍕 Pizza', description: 'Freshly baked pizzas' },
  });

  const drinksCategory = await prisma.category.create({
    data: { name: '🥤 Drinks', description: 'Refreshing beverages' },
  });

  const dessertsCategory = await prisma.category.create({
    data: { name: '🍰 Desserts', description: 'Sweet treats' },
  });

  // Products
  await prisma.product.createMany({
    data: [
      // Burgers
      { categoryId: burgersCategory.id, name: '🍔 Veg Burger', price: 149, stock: 100 },
      { categoryId: burgersCategory.id, name: '🍔 Cheese Burger', price: 199, stock: 100 },
      { categoryId: burgersCategory.id, name: '🍔 Chicken Burger', price: 249, stock: 100 },
      // Pizza
      { categoryId: pizzaCategory.id, name: '🍕 Margherita Pizza', price: 299, stock: 100 },
      { categoryId: pizzaCategory.id, name: '🍕 Farmhouse Pizza', price: 399, stock: 100 },
      { categoryId: pizzaCategory.id, name: '🍕 Paneer Pizza', price: 349, stock: 100 },
      // Drinks
      { categoryId: drinksCategory.id, name: '🥤 Coke', price: 49, stock: 100 },
      { categoryId: drinksCategory.id, name: '🥤 Pepsi', price: 49, stock: 100 },
      { categoryId: drinksCategory.id, name: '🥤 Cold Coffee', price: 99, stock: 100 },
      // Desserts
      { categoryId: dessertsCategory.id, name: '🍰 Brownie', price: 149, stock: 100 },
      { categoryId: dessertsCategory.id, name: '🍰 Chocolate Cake', price: 199, stock: 100 },
      { categoryId: dessertsCategory.id, name: '🍰 Ice Cream Sundae', price: 129, stock: 100 },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });