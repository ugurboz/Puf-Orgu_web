'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories'),
                ]);

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setProducts(productsData.products || []);
                setCategories(categoriesData.categories || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const filteredProducts =
        activeCategory === 'all'
            ? products
            : products.filter((p) => p.category === activeCategory);

    if (loading) {
        return (
            <div className="section">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="container">
                <h1 className="section-title">Ürünlerimiz</h1>
                <p className="text-muted" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    El yapımı örgü ürünlerimizi keşfedin
                </p>

                {/* Category Filter */}
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        Tümü
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.slug)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="featured-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon" style={{ fontSize: '64px' }}>🧶</div>
                        <h3>Bu kategoride ürün bulunamadı</h3>
                        <p>Farklı bir kategori seçmeyi deneyin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
