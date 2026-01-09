'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }) {
    const { slug } = use(params);
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();

                const foundProduct = data.products?.find((p) => p.slug === slug);

                if (foundProduct) {
                    setProduct(foundProduct);

                    // Get similar products
                    const similar = data.products
                        ?.filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
                        .slice(0, 3);
                    setSimilarProducts(similar || []);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    // Emoji mapping for categories
    const categoryEmojis = {
        bereler: '🧢',
        yelekler: '🧥',
        aksesuarlar: '🧣',
    };

    if (loading) {
        return (
            <div className="product-detail">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        notFound();
    }

    const hasImages = product.images && product.images.length > 0;

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '24px', fontSize: '14px' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)' }}>Ana Sayfa</Link>
                    <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
                    <Link href="/urunler" style={{ color: 'var(--color-text-muted)' }}>Ürünler</Link>
                    <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
                    <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
                </nav>

                <div className="product-detail-content">
                    {/* Product Gallery */}
                    <div className="product-gallery">
                        <div className="product-main-image" style={{ position: 'relative' }}>
                            {hasImages ? (
                                <>
                                    <Image
                                        key={selectedImageIndex} // Force re-render
                                        src={product.images[selectedImageIndex]}
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority
                                    />
                                    {/* Navigation Arrows */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                style={{
                                                    position: 'absolute',
                                                    left: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: 'rgba(255,255,255,0.95)',
                                                    color: 'var(--color-brown-dark)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '28px',
                                                    lineHeight: 1,
                                                    paddingBottom: '4px', // Align arrow center
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                    zIndex: 20,
                                                    transition: 'all 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                                            >
                                                ‹
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: 'rgba(255,255,255,0.95)',
                                                    color: 'var(--color-brown-dark)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '28px',
                                                    lineHeight: 1,
                                                    paddingBottom: '4px', // Align arrow center
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                    zIndex: 20,
                                                    transition: 'all 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                                            >
                                                ›
                                            </button>
                                            {/* Image Counter */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '12px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {selectedImageIndex + 1} / {product.images.length}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #F5F1EB 0%, #E8E1D5 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '120px',
                                    }}
                                >
                                    {categoryEmojis[product.category] || '🧶'}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasImages && product.images.length > 1 && (
                            <div className="product-thumbnails">
                                {product.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`product-thumbnail ${i === selectedImageIndex ? 'active' : ''}`}
                                        onClick={() => setSelectedImageIndex(i)}
                                        style={{
                                            position: 'relative',
                                            cursor: 'pointer',
                                            border: i === selectedImageIndex ? '2px solid var(--color-brown-light)' : '2px solid transparent',
                                        }}
                                    >
                                        <Image src={img} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.categoryName || product.category}</span>
                        <h1>{product.name}</h1>
                        <p className="product-description">
                            {product.longDescription || product.description}
                        </p>

                        {/* Specifications */}
                        {product.specifications && (product.specifications.material || product.specifications.dimensions || (product.specifications.colors && product.specifications.colors.length > 0)) && (
                            <div className="product-specs">
                                <h3>Ürün Özellikleri</h3>
                                <div className="product-specs-list">
                                    {product.specifications.material && (
                                        <div className="product-spec-item">
                                            <span>Malzeme</span>
                                            <span>{product.specifications.material}</span>
                                        </div>
                                    )}
                                    {product.specifications.dimensions && (
                                        <div className="product-spec-item">
                                            <span>Ölçüler</span>
                                            <span>{product.specifications.dimensions}</span>
                                        </div>
                                    )}
                                    {product.specifications.colors && product.specifications.colors.length > 0 && (
                                        <div className="product-spec-item">
                                            <span>Renkler</span>
                                            <span>{product.specifications.colors.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Custom Production Notice */}
                        <div className="custom-notice">
                            <div className="custom-notice-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </div>
                            <div className="custom-notice-text">
                                <h4>Kişiye Özel Üretim</h4>
                                <p>
                                    Bu ürün siparişinize özel olarak üretilecektir.
                                    Farklı renk veya ölçü tercihlerinizi bize iletebilirsiniz.
                                </p>
                            </div>
                        </div>

                        {/* Order Button */}
                        <WhatsAppButton productName={product.name} className="btn-lg product-order-btn" />
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className="section" style={{ paddingTop: '64px' }}>
                        <h2 className="section-title">Benzer Ürünler</h2>
                        <div className="featured-grid">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
