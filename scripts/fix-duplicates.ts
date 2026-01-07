import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDuplicates() {
  console.log('Starting cleanup...\n');

  // Get all users
  const users = await prisma.user.findMany({
    select: { id: true, username: true }
  });

  for (const user of users) {
    console.log(`\nProcessing user: ${user.username}`);

    // Delete all tracks and topics for this user (cascade will delete topics)
    const deleted = await prisma.track.deleteMany({
      where: { userId: user.id }
    });
    
    console.log(`  Deleted ${deleted.count} tracks`);
  }

  console.log('\n✅ Cleanup complete! All users can now create fresh tracks.');
  await prisma.$disconnect();
}

fixDuplicates().catch(console.error);
