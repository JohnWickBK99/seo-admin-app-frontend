import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";

async function main() {
    const password = await hash("admin123", 10); // Hash password
    const user = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            name: "Admin",
            password,
            role: "admin",
        },
    });
    console.log("Seeded user:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 