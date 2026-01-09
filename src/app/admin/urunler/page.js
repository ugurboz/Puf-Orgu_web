'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'featured'
    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuth');
        if (!isAuth) {
            router.push('/admin/login');
            return;
        }
        loadProducts();
    }, [router]);

    const loadProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleToggleFeatured = async (product) => {
        try {
            const updatedProduct = {
                ...product,
                featured: !product.featured,
                featuredOrder: !product.featured ? (Math.max(...products.map(p => p.featuredOrder || 0)) + 1) : 0
            };

            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });

            if (res.ok) {
                setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleMoveUp = async (product) => {
        const featuredProducts = products
            .filter(p => p.featured)
            .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

        const currentIndex = featuredProducts.findIndex(p => p.id === product.id);
        if (currentIndex <= 0) return;

        const prevProduct = featuredProducts[currentIndex - 1];

        // Swap orders
        const newProducts = products.map(p => {
            if (p.id === product.id) {
                return { ...p, featuredOrder: prevProduct.featuredOrder };
            }
            if (p.id === prevProduct.id) {
                return { ...p, featuredOrder: product.featuredOrder };
            }
            return p;
        });

        setProducts(newProducts);

        // Save both to API
        await Promise.all([
            fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, featuredOrder: prevProduct.featuredOrder }),
            }),
            fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...prevProduct, featuredOrder: product.featuredOrder }),
            }),
        ]);
    };

    const handleMoveDown = async (product) => {
        const featuredProducts = products
            .filter(p => p.featured)
            .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

        const currentIndex = featuredProducts.findIndex(p => p.id === product.id);
        if (currentIndex >= featuredProducts.length - 1) return;

        const nextProduct = featuredProducts[currentIndex + 1];

        // Swap orders
        const newProducts = products.map(p => {
            if (p.id === product.id) {
                return { ...p, featuredOrder: nextProduct.featuredOrder };
            }
            if (p.id === nextProduct.id) {
                return { ...p, featuredOrder: product.featuredOrder };
            }
            return p;
        });

        setProducts(newProducts);

        // Save both to API
        await Promise.all([
            fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, featuredOrder: nextProduct.featuredOrder }),
            }),
            fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...nextProduct, featuredOrder: product.featuredOrder }),
            }),
        ]);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
    };

    const categoryEmojis = {
        bereler: '🧢',
        yelekler: '🧥',
        aksesuarlar: '🧣',
    };

    const featuredProducts = products
        .filter(p => p.featured)
        .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminSidebar onLogout={handleLogout} />
                <div className="admin-content">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar onLogout={handleLogout} />
            <div className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Ürünler</h1>
                    <Link href="/admin/urunler/new" className="btn btn-primary">
                        + Yeni Ürün Ekle
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button
                        className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Tüm Ürünler ({products.length})
                    </button>
                    <button
                        className={`btn ${activeTab === 'featured' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('featured')}
                    >
                        Öne Çıkanlar ({featuredProducts.length})
                    </button>
                </div>

                {activeTab === 'all' ? (
                    /* All Products Tab */
                    products.length > 0 ? (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Görsel</th>
                                        <th>Ürün Adı</th>
                                        <th>Kategori</th>
                                        <th>Öne Çıkan</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        background: 'linear-gradient(135deg, #F5F1EB 0%, #E8E1D5 100%)',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '24px',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {product.images && product.images.length > 0 ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        categoryEmojis[product.category] || '🧶'
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{product.name}</strong>
                                                <br />
                                                <small style={{ color: 'var(--color-text-muted)' }}>
                                                    {product.description?.substring(0, 50)}...
                                                </small>
                                            </td>
                                            <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleFeatured(product)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        background: product.featured ? 'var(--color-success)' : 'var(--color-beige)',
                                                        color: product.featured ? 'white' : 'var(--color-text-muted)'
                                                    }}
                                                >
                                                    {product.featured ? '✓ Öne Çıkan' : 'Ekle'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <Link
                                                        href={`/admin/urunler/${product.id}`}
                                                        className="btn admin-btn-sm admin-btn-edit"
                                                    >
                                                        Düzenle
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="btn admin-btn-sm admin-btn-delete"
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ fontSize: '64px' }}>📦</div>
                            <h3>Henüz ürün eklenmemiş</h3>
                            <p>İlk ürününüzü ekleyerek başlayın.</p>
                            <Link href="/admin/urunler/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
                                + Yeni Ürün Ekle
                            </Link>
                        </div>
                    )
                ) : (
                    /* Featured Products Tab */
                    <div>
                        <div style={{
                            background: 'var(--color-beige)',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            fontSize: '14px',
                            color: 'var(--color-text-light)'
                        }}>
                            💡 <strong>İpucu:</strong> Öne çıkan ürünlerin sırasını değiştirmek için yukarı/aşağı oklarını kullanın.
                            Bu sıralama ana sayfada gösterilecek sırayı belirler.
                        </div>

                        {featuredProducts.length > 0 ? (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '80px' }}>Sıra</th>
                                            <th>Görsel</th>
                                            <th>Ürün Adı</th>
                                            <th>Kategori</th>
                                            <th>Sıralama</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {featuredProducts.map((product, index) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '32px',
                                                        height: '32px',
                                                        background: 'var(--color-brown-light)',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        fontWeight: '600'
                                                    }}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            background: 'linear-gradient(135deg, #F5F1EB 0%, #E8E1D5 100%)',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '20px',
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {product.images && product.images.length > 0 ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                fill
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            categoryEmojis[product.category] || '🧶'
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong>{product.name}</strong>
                                                </td>
                                                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <button
                                                            onClick={() => handleMoveUp(product)}
                                                            disabled={index === 0}
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--color-beige-dark)',
                                                                background: index === 0 ? 'var(--color-beige)' : 'white',
                                                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                                opacity: index === 0 ? 0.5 : 1
                                                            }}
                                                            title="Yukarı Taşı"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            onClick={() => handleMoveDown(product)}
                                                            disabled={index === featuredProducts.length - 1}
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--color-beige-dark)',
                                                                background: index === featuredProducts.length - 1 ? 'var(--color-beige)' : 'white',
                                                                cursor: index === featuredProducts.length - 1 ? 'not-allowed' : 'pointer',
                                                                opacity: index === featuredProducts.length - 1 ? 0.5 : 1
                                                            }}
                                                            title="Aşağı Taşı"
                                                        >
                                                            ↓
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleToggleFeatured(product)}
                                                        className="btn admin-btn-sm"
                                                        style={{ background: '#fee2e2', color: '#dc2626' }}
                                                    >
                                                        Kaldır
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon" style={{ fontSize: '64px' }}>⭐</div>
                                <h3>Öne çıkan ürün yok</h3>
                                <p>Tüm Ürünler sekmesinden ürünleri öne çıkan olarak işaretleyebilirsiniz.</p>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className="btn btn-primary"
                                    style={{ marginTop: '16px' }}
                                >
                                    Tüm Ürünlere Git
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
