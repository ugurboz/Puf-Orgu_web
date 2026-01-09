import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform data for frontend compatibility
        const transformedProducts = products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            longDescription: p.longDescription,
            category: p.category.slug,
            categoryName: p.category.name,
            images: p.images,
            specifications: {
                material: p.material,
                dimensions: p.dimensions,
                colors: p.colors,
            },
            featured: p.featured,
            featuredOrder: p.featuredOrder,
            createdAt: p.createdAt.toISOString().split('T')[0],
        }));

        return NextResponse.json({ products: transformedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Find category by slug
        const category = await prisma.category.findUnique({
            where: { slug: data.category },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                longDescription: data.longDescription || null,
                categoryId: category.id,
                material: data.specifications?.material || null,
                dimensions: data.specifications?.dimensions || null,
                colors: data.specifications?.colors || [],
                images: data.images || [],
                featured: data.featured || false,
                featuredOrder: data.featuredOrder || 0,
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();

        // Find category by slug
        const category = await prisma.category.findUnique({
            where: { slug: data.category },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                longDescription: data.longDescription || null,
                categoryId: category.id,
                material: data.specifications?.material || null,
                dimensions: data.specifications?.dimensions || null,
                colors: data.specifications?.colors || [],
                images: data.images || [],
                featured: data.featured || false,
                featuredOrder: data.featuredOrder || 0,
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
