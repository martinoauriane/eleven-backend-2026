import 'dotenv/config';  // ⚡ force le chargement de ton .env
import { prisma } from "../prisma";

async function main() {
  const alice = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alicejohnson@gmail.com',
      passwordHash: 'secret',
      homeAddress: '123 Main St, Springfield',
      isOnline: true,
      status: 'wants_to_go_out',
      lastLogin: '2023-10-01T12:00:00Z',
      partyAddress: '456 Party Ave, Springfield',
      partyCoords: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      friendsNumber: 5,
    },
  });
  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
