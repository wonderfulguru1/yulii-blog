import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';

const initialBlogPosts = [
  {
    title: "How to Spot Bank Fraud and Protect Your Money",
    category: "Product Updates",
    excerpt: "Learn essential tips to identify and prevent bank fraud to keep your money safe.",
    content: "Bank fraud is a serious threat that affects millions of people worldwide. In this comprehensive guide, we'll explore the most common types of bank fraud and provide you with actionable steps to protect yourself and your finances...",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    status: "Published",
    author: "John Doe",
    createdAt: new Date('2025-09-17'),
    updatedAt: new Date('2025-09-17')
  },
  {
    title: "Needs vs Wants: The Smart Way to Manage Money and Save",
    category: "Business Life",
    excerpt: "Learn the difference between needs and wants to make smarter financial decisions.",
    content: "Understanding the difference between needs and wants is fundamental to building a solid financial foundation. This guide will help you categorize your expenses and make better spending decisions...",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
    status: "Published",
    author: "Jane Smith",
    createdAt: new Date('2025-09-26'),
    updatedAt: new Date('2025-09-26')
  },
  {
    title: "Top Fintech Companies Leading Innovation",
    category: "News",
    excerpt: "Discover the companies revolutionizing financial technology this year.",
    content: "The fintech industry continues to evolve at a rapid pace, with innovative companies transforming how we handle money, make payments, and access financial services...",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    status: "Published",
    author: "Mike Johnson",
    createdAt: new Date('2025-09-24'),
    updatedAt: new Date('2025-09-24')
  },
  {
    title: "How to Save Smarter and Earn Up to 18% Interest",
    category: "Business Tips",
    excerpt: "Maximize your savings with these proven strategies and high-yield accounts.",
    content: "Saving money is just the beginning. Learn how to make your savings work harder for you with high-yield accounts and smart investment strategies...",
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&h=600&fit=crop",
    status: "Published",
    author: "Sarah Williams",
    createdAt: new Date('2025-09-22'),
    updatedAt: new Date('2025-09-22')
  },
  {
    title: "Digital Payment Trends Reshaping Commerce",
    category: "Tech & Processes",
    excerpt: "Explore how digital payments are transforming the way we do business.",
    content: "Digital payments are revolutionizing commerce, making transactions faster, more secure, and more convenient for businesses and consumers alike...",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    status: "Published",
    author: "David Brown",
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    title: "Essential Tips for Small Business Financial Success",
    category: "Business Tips",
    excerpt: "Build a solid financial foundation for your small business with expert advice.",
    content: "Running a successful small business requires careful financial planning and management. Here are the essential tips every small business owner should know...",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    status: "Published",
    author: "Emily Davis",
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-18')
  },
  {
    title: "The Future of Banking: What to Expect",
    category: "Impact Stories",
    excerpt: "A look at emerging technologies shaping the future of financial services.",
    content: "The banking industry is undergoing a massive transformation driven by technology, changing customer expectations, and new regulatory frameworks...",
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&h=600&fit=crop",
    status: "Published",
    author: "Chris Wilson",
    createdAt: new Date('2025-09-15'),
    updatedAt: new Date('2025-09-15')
  },
  {
    title: "Understanding Cryptocurrency for Business",
    category: "Tech & Processes",
    excerpt: "A beginner's guide to cryptocurrency and its potential impact on business.",
    content: "Cryptocurrency is no longer just a buzzword. Many businesses are exploring how digital currencies can improve their operations and customer experience...",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    status: "Draft",
    author: "Alex Chen",
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-10')
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting to seed database...');
    
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to seed database');
    }
    
    // Check if database is already seeded
    const existingPosts = await getDocs(collection(db, 'posts'));
    if (existingPosts.size > 0) {
      console.log('Database already has posts, skipping seed');
      return { success: true, message: 'Database already seeded' };
    }
    
    const addedPosts = [];
    for (const post of initialBlogPosts) {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...post,
        author: auth.currentUser.email || 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      addedPosts.push(docRef.id);
      console.log(`Added post: ${post.title} with ID: ${docRef.id}`);
    }
    
    console.log(`Database seeded successfully! Added ${addedPosts.length} posts.`);
    return { 
      success: true, 
      message: `Successfully added ${addedPosts.length} blog posts`,
      addedCount: addedPosts.length
    };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred',
      details: error
    };
  }
};

// Function to check if database is already seeded
export const checkIfSeeded = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking if database is seeded:', error);
    return false;
  }
};
