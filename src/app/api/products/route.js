import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

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
            price: p.price,
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
            inStock: p.inStock,
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
                price: data.price !== undefined ? Number(data.price) : 0,
                categoryId: category.id,
                material: data.specifications?.material || null,
                dimensions: data.specifications?.dimensions || null,
                colors: data.specifications?.colors || [],
                images: data.images || [],
                featured: data.featured || false,
                featuredOrder: data.featuredOrder || 0,
                inStock: data.inStock !== undefined ? data.inStock : true,
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
                price: data.price !== undefined ? Number(data.price) : 0,
                categoryId: category.id,
                material: data.specifications?.material || null,
                dimensions: data.specifications?.dimensions || null,
                colors: data.specifications?.colors || [],
                images: data.images || [],
                featured: data.featured || false,
                featuredOrder: data.featuredOrder || 0,
                inStock: data.inStock !== undefined ? data.inStock : true,
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

        // First, get the product to retrieve its images
        const product = await prisma.product.findUnique({
            where: { id },
            select: { images: true },
        });

        // Delete images from Supabase Storage if they exist
        if (product?.images && product.images.length > 0) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);

                // Extract filenames from URLs
                const filenames = product.images.map((url) => {
                    // URL format: https://xxx.supabase.co/storage/v1/object/public/puf-orgu-products/filename
                    const parts = url.split('/');
                    return parts[parts.length - 1];
                }).filter(Boolean);

                if (filenames.length > 0) {
                    const { error } = await supabase.storage
                        .from('puf-orgu-products')
                        .remove(filenames);

                    if (error) {
                        console.error('Error deleting images from storage:', error);
                        // Continue with product deletion even if image deletion fails
                    }
                }
            }
        }

        // Delete product from database
        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
