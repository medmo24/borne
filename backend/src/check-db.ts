import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const stations = await prisma.station.findMany();
    console.log('Stations in DB:', stations);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
