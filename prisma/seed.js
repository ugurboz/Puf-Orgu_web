import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create categories
    const bereler = await prisma.category.upsert({
        where: { slug: 'bereler' },
        update: {},
        create: {
            name: 'Bereler',
            slug: 'bereler',
            description: 'El örgüsü bereler',
        },
    });

    const yelekler = await prisma.category.upsert({
        where: { slug: 'yelekler' },
        update: {},
        create: {
            name: 'Yelekler',
            slug: 'yelekler',
            description: 'El örgüsü yelekler',
        },
    });

    const aksesuarlar = await prisma.category.upsert({
        where: { slug: 'aksesuarlar' },
        update: {},
        create: {
            name: 'Aksesuarlar',
            slug: 'aksesuarlar',
            description: 'Örgü aksesuarlar ve diğer ürünler',
        },
    });

    // Create products
    await prisma.product.upsert({
        where: { slug: 'klasik-orgu-bere' },
        update: {},
        create: {
            name: 'Klasik Örgü Bere',
            slug: 'klasik-orgu-bere',
            description: 'El örgüsü pamuk ipten yapılmış, sıcak tutan şık bere.',
            longDescription: 'Tamamen el yapımı bu bere, özenle seçilmiş %100 pamuk iplerden örülmüştür.',
            categoryId: bereler.id,
            material: 'Pamuk ip',
            dimensions: 'Standart yetişkin bedeni',
            colors: ['Bej', 'Krem', 'Beyaz'],
            images: [],
            featured: true,
            featuredOrder: 1,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'ponponlu-bere' },
        update: {},
        create: {
            name: 'Ponponlu Bere',
            slug: 'ponponlu-bere',
            description: 'Ponponlu sevimli el örgüsü bere.',
            longDescription: 'Bu el yapımı ponponlu bere, hem şık hem de eğlenceli bir görünüm sunar.',
            categoryId: bereler.id,
            material: 'Yün karışımı ip',
            dimensions: 'Standart yetişkin bedeni',
            colors: ['Gri', 'Pembe', 'Mavi'],
            images: [],
            featured: true,
            featuredOrder: 2,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'duz-orgu-yelek' },
        update: {},
        create: {
            name: 'Düz Örgü Yelek',
            slug: 'duz-orgu-yelek',
            description: 'Klasik düz örgü el yapımı yelek.',
            longDescription: 'Zarif ve şık bu el örgüsü yelek, hem günlük kullanım hem de özel günler için idealdir.',
            categoryId: yelekler.id,
            material: 'Pamuk ip',
            dimensions: 'S, M, L, XL',
            colors: ['Krem', 'Bej', 'Kahve'],
            images: [],
            featured: true,
            featuredOrder: 3,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'v-yaka-yelek' },
        update: {},
        create: {
            name: 'V Yaka Yelek',
            slug: 'v-yaka-yelek',
            description: 'Şık V yaka tasarımlı el örgüsü yelek.',
            longDescription: 'Modern V yaka tasarımıyla dikkat çeken bu yelek, el yapımı olarak özenle üretilmiştir.',
            categoryId: yelekler.id,
            material: 'Yün karışımı',
            dimensions: 'S, M, L, XL',
            colors: ['Lacivert', 'Bordo', 'Yeşil'],
            images: [],
            featured: true,
            featuredOrder: 4,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'orgu-atki-bere-seti' },
        update: {},
        create: {
            name: 'Örgü Atkı-Bere Seti',
            slug: 'orgu-atki-bere-seti',
            description: 'El örgüsü uyumlu atkı ve bere seti.',
            longDescription: 'Bu şık set, el örgüsü bere ve uyumlu atkıdan oluşmaktadır. Hediye olarak da idealdir.',
            categoryId: aksesuarlar.id,
            material: 'Pamuk ip',
            dimensions: 'Standart beden',
            colors: ['Karışık pastel tonlar'],
            images: [],
            featured: false,
            featuredOrder: 0,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'el-orgusu-eldiven' },
        update: {},
        create: {
            name: 'El Örgüsü Eldiven',
            slug: 'el-orgusu-eldiven',
            description: 'Parmaksız el örgüsü eldiven.',
            longDescription: 'Parmaksız tasarımıyla hem sıcak tutar hem de telefon kullanımına izin verir.',
            categoryId: aksesuarlar.id,
            material: 'Yün karışımı ip',
            dimensions: 'Standart beden',
            colors: ['Gri', 'Bej', 'Siyah'],
            images: [],
            featured: false,
            featuredOrder: 0,
        },
    });

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'puf2024', 10);
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log('✅ Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
