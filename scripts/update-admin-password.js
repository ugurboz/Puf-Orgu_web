import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.error('Error: ADMIN_PASSWORD is not defined in .env');
        process.exit(1);
    }

    console.log('Updating admin password...');

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const updatedAdmin = await prisma.admin.update({
            where: { username: 'admin' },
            data: { password: hashedPassword },
        });
        console.log(`✅ Admin password updated successfully for user: ${updatedAdmin.username}`);
    } catch (error) {
        if (error.code === 'P2025') {
            console.error('Error: Admin user not found. Please verify the seed script ran correctly.');
        } else {
            console.error('Error updating password:', error);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
