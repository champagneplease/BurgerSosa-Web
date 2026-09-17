import { PrismaClient, Role, OrderType, OrderStatus, MovementType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  const hashedPassword = await bcrypt.hash('hashedpassword123', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@burgersosa.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@burgersosa.com',
      password: hashedPassword,
      name: 'Admin Sosa',
      role: Role.ADMIN,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'empleado@burgersosa.com' },
    update: { password: hashedPassword },
    create: {
      email: 'empleado@burgersosa.com',
      password: hashedPassword,
      name: 'Empleado Juan',
      role: Role.EMPLOYEE,
    },
  });

  // 2. Create Categories
  const catBurgers = await prisma.category.create({
    data: { name: 'Hamburguesas', order: 1 }
  });
  const catFries = await prisma.category.create({
    data: { name: 'Papas', order: 2 }
  });
  const catDrinks = await prisma.category.create({
    data: { name: 'Bebidas', order: 3 }
  });

  // 3. Create Ingredients
  const ingPan = await prisma.ingredient.create({
    data: { name: 'Pan de Hamburguesa', unit: 'unidades', currentStock: 100, minStock: 20 }
  });
  const ingCarne = await prisma.ingredient.create({
    data: { name: 'Medallón de Carne', unit: 'unidades', currentStock: 200, minStock: 50 }
  });
  const ingCheddar = await prisma.ingredient.create({
    data: { name: 'Queso Cheddar', unit: 'gramos', currentStock: 5000, minStock: 1000 }
  });
  const ingPanceta = await prisma.ingredient.create({
    data: { name: 'Panceta', unit: 'gramos', currentStock: 3000, minStock: 500 }
  });
  const ingCebolla = await prisma.ingredient.create({
    data: { name: 'Cebolla', unit: 'gramos', currentStock: 2000, minStock: 500 }
  });
  const ingSalsa = await prisma.ingredient.create({
    data: { name: 'Salsa Sosa', unit: 'mililitros', currentStock: 4000, minStock: 1000 }
  });

  // 4. Create Product with Recipe
  const productDobleBacon = await prisma.product.create({
    data: {
      name: 'Doble Bacon',
      description: 'Doble medallón, cheddar, panceta y salsa sosa.',
      price: 12000,
      categoryId: catBurgers.id,
      recipe: {
        create: [
          { ingredientId: ingPan.id, quantity: 1 },
          { ingredientId: ingCarne.id, quantity: 2 },
          { ingredientId: ingCheddar.id, quantity: 40 }, // 40 gramos
          { ingredientId: ingPanceta.id, quantity: 50 }, // 50 gramos
          { ingredientId: ingSalsa.id, quantity: 30 }, // 30 ml
        ]
      }
    }
  });

  // 5. Create Modifiers
  const modExtraCarne = await prisma.modifier.create({
    data: {
      name: 'Medallón Extra',
      price: 2000,
      productId: productDobleBacon.id,
      ingredients: {
        create: [
          { ingredientId: ingCarne.id, quantity: 1 } // Deducts 1 more patty
        ]
      }
    }
  });

  const modSinCebolla = await prisma.modifier.create({
    data: {
      name: 'Sin Cebolla',
      price: 0,
      productId: productDobleBacon.id,
      // Here, quantity could be negative to signify "add back to stock" if the base recipe had onion, 
      // but since base recipe didn't have onion, let's pretend it did by adding a negative quantity, 
      // or we just leave ingredients empty if it doesn't affect stock.
    }
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
