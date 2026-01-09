import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const product = await prisma.product.findFirst({
        where: { slug: 'el-orgusu-eldiven' },
    });

    if (product) {
        await prisma.product.update({
            where: { id: product.id },
            data: {
                images: ['/uploads/test-image-1.svg', '/uploads/test-image-2.svg'],
            },
            include: { category: true } // Just to verify connection
        });
        console.log('✅ Updated product images for:', product.name);
    } else {
        console.log('❌ Product not found');
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
