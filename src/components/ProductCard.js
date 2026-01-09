import Link from 'next/link';
import Image from 'next/image';
import WhatsAppButton from './WhatsAppButton';

export default function ProductCard({ product }) {
    // Emoji mapping for categories
    const categoryEmojis = {
        bereler: '🧢',
        yelekler: '🧥',
        aksesuarlar: '🧣',
    };

    const hasImage = product.images && product.images.length > 0;

    return (
        <div className="product-card">
            <Link href={`/urunler/${product.slug}`}>
                <div className="product-card-image">
                    {product.featured && (
                        <span className="product-card-badge">Öne Çıkan</span>
                    )}
                    {hasImage ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, #F5F1EB 0%, #E8E1D5 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '64px',
                            }}
                        >
                            {categoryEmojis[product.category] || '🧶'}
                        </div>
                    )}
                </div>
            </Link>

            <div className="product-card-content">
                <span className="product-card-category">{product.categoryName || product.category}</span>
                <Link href={`/urunler/${product.slug}`}>
                    <h3 className="product-card-title">{product.name}</h3>
                </Link>
                <p className="product-card-desc">{product.description}</p>

                {product.specifications && (
                    <div className="product-card-meta">
                        {product.specifications.dimensions && (
                            <span className="product-card-tag">{product.specifications.dimensions}</span>
                        )}
                        {product.specifications.colors && product.specifications.colors[0] && (
                            <span className="product-card-tag">{product.specifications.colors[0]}</span>
                        )}
                    </div>
                )}

                <WhatsAppButton productName={product.name} />
            </div>
        </div>
    );
}
