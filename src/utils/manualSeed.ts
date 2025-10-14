// Manual seeding function for browser console
// Run this in the browser console if the UI seeding fails

import { seedDatabase } from './seedDatabase';

// Make it available globally for console use
(window as any).seedBlogDatabase = async () => {
  console.log('Starting manual database seeding...');
  const result = await seedDatabase();
  
  if (result.success) {
    console.log('✅ Database seeded successfully!');
    console.log(`Added ${result.addedCount || 0} blog posts`);
    console.log('Refresh the page to see the new posts');
  } else {
    console.error('❌ Failed to seed database:', result.error);
    console.error('Details:', result.details);
  }
  
  return result;
};

// Also provide a function to check database status
import { checkIfSeeded } from './seedDatabase';

(window as any).checkBlogDatabase = async () => {
  const isSeeded = await checkIfSeeded();
  console.log(isSeeded ? '✅ Database is seeded' : '❌ Database is empty');
  return isSeeded;
};

console.log('Manual seeding functions available:');
console.log('- seedBlogDatabase() - Seed the database with sample posts');
console.log('- checkBlogDatabase() - Check if database is seeded');
