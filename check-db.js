const { prisma } = require('./lib/prisma.ts');

async function checkData() {
  console.log('\n=== USERS ===');
  const users = await prisma.user.findMany({
    select: { id: true, username: true, createdAt: true }
  });
  console.log(users);

  console.log('\n=== TRACKS BY USER ===');
  const tracks = await prisma.track.findMany({
    include: {
      user: { select: { username: true } },
      _count: { select: { topics: true } }
    },
    orderBy: [{ userId: 'asc' }, { name: 'asc' }]
  });
  
  tracks.forEach(track => {
    console.log(`User: ${track.user.username} | Track: ${track.name} | Topics: ${track._count.topics}`);
  });

  await prisma.$disconnect();
}

checkData().catch(console.error);
