import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ
  await prisma.comment.deleteMany({});
  await prisma.tagsOnPosts.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.keyToken.deleteMany({});
  await prisma.user.deleteMany({});

  // Tạo users
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashPassword('Admin@123'),
      role: 'ADMIN',
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      username: 'editor',
      email: 'editor@example.com',
      name: 'Editor User',
      password: hashPassword('Editor@123'),
      role: 'EDITOR',
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      username: 'viewer',
      email: 'viewer@example.com',
      name: 'Viewer User',
      password: hashPassword('Viewer@123'),
      role: 'VIEWER',
    },
  });

  // Tạo categories
  const techCategory = await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
    },
  });

  const lifestyleCategory = await prisma.category.create({
    data: {
      name: 'Lifestyle',
      slug: 'lifestyle',
    },
  });

  // Tạo tags
  const webTag = await prisma.tag.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
    },
  });

  const jsTag = await prisma.tag.create({
    data: {
      name: 'JavaScript',
      slug: 'javascript',
    },
  });

  const healthTag = await prisma.tag.create({
    data: {
      name: 'Health',
      slug: 'health',
    },
  });

  // Tạo posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with React',
      slug: 'getting-started-with-react',
      content:
        'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently update the DOM when data changes.',
      excerpt: 'A beginner-friendly introduction to React',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: techCategory.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Healthy Lifestyle Tips',
      slug: 'healthy-lifestyle-tips',
      content:
        'Maintaining a healthy lifestyle is important for both physical and mental well-being. Regular exercise, a balanced diet, and adequate sleep are key components.',
      excerpt: 'Simple tips for a healthier life',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: editorUser.id,
      categoryId: lifestyleCategory.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Advanced JavaScript Patterns',
      slug: 'advanced-javascript-patterns',
      content:
        'This post covers advanced JavaScript patterns including module patterns, singleton patterns, and prototype patterns.',
      excerpt: 'Improving your JavaScript code with design patterns',
      status: 'DRAFT',
      authorId: adminUser.id,
      categoryId: techCategory.id,
    },
  });

  // Liên kết tags với posts
  await prisma.tagsOnPosts.createMany({
    data: [
      { postId: post1.id, tagId: webTag.id },
      { postId: post1.id, tagId: jsTag.id },
      { postId: post2.id, tagId: healthTag.id },
      { postId: post3.id, tagId: jsTag.id },
    ],
  });

  // Tạo comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great article! This helped me a lot.',
        status: 'APPROVED',
        authorId: viewerUser.id,
        postId: post1.id,
      },
      {
        content: 'I have a question about React hooks. Can you explain them?',
        status: 'APPROVED',
        authorId: editorUser.id,
        postId: post1.id,
      },
      {
        content: 'These health tips are really useful. Thanks!',
        status: 'APPROVED',
        authorId: adminUser.id,
        postId: post2.id,
      },
      {
        content: 'I would add meditation to the list as well.',
        status: 'PENDING',
        authorId: viewerUser.id,
        postId: post2.id,
      },
    ],
  });

  console.log('Seed data created successfully');
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
