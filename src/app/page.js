import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { featuredOrder: 'asc' },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
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
  }));
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                <span>El Yapımı & Kişiye Özel</span>
              </div>
              <h1>El Emeği, Göz Nuru Örgü Tasarımlar</h1>
              <p className="hero-subtitle">
                Her ilmeği sevgiyle örülmüş, size özel tasarlanmış benzersiz
                el yapımı örgü ürünleri. Bereler, yelekler ve daha fazlası...
              </p>
              <div className="hero-buttons">
                <WhatsAppButton className="btn-lg" />
                <Link href="/urunler" className="btn btn-outline btn-lg">
                  Ürünleri Keşfet
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-decoration hero-decoration-1"></div>
              <div className="hero-decoration hero-decoration-2"></div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #F5F1EB 0%, #E8E1D5 100%)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '120px',
                  boxShadow: '0 8px 40px rgba(74, 66, 56, 0.12)'
                }}
              >
                🧶
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured">
        <div className="container">
          <div className="featured-header">
            <h2 className="section-title">Öne Çıkan Ürünler</h2>
            <p className="text-muted">En beğenilen el yapımı örgü ürünlerimiz</p>
          </div>
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="view-all-btn">
            <Link href="/urunler" className="btn btn-outline btn-lg">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section story">
        <div className="container">
          <div className="story-content">
            <div className="story-image">
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #D4A574 0%, #C4A484 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px'
                }}
              >
                ✨
              </div>
            </div>
            <div className="story-text">
              <h2>Hikayemiz</h2>
              <p>
                Puf Örgü, el sanatlarına olan tutkudan doğdu. Her ürünümüz,
                geleneksel örgü tekniklerini modern tasarımlarla buluşturan
                bir sevgi emeğidir.
              </p>
              <p>
                Yılların deneyimi ve özeniyle, evinize sıcaklık katacak benzersiz
                parçalar üretiyoruz. Her ilmek, her düğüm özenle ve sabırla
                işlenerek sizlere ulaşıyor.
              </p>
              <Link href="/hakkimizda" className="btn btn-primary">
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section advantages">
        <div className="container">
          <h2 className="section-title">Neden Puf Örgü?</h2>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>El Yapımı</h3>
              <p>Tüm ürünlerimiz tek tek el işçiliği ile üretilmektedir.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
              <h3>Özel Tasarım</h3>
              <p>Her ürün benzersiz tasarım ve dikkatle hazırlanır.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Kişiye Özel</h3>
              <p>İstediğiniz renk ve ölçüde sipariş verebilirsiniz.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Kaliteli Malzeme</h3>
              <p>En kaliteli doğal iplikler kullanılmaktadır.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <h2>Hayalinizdeki Ürünü Birlikte Tasarlayalım</h2>
          <p>
            Özel bir tasarım mı istiyorsunuz? WhatsApp üzerinden bizimle
            iletişime geçin, size özel ürününüzü birlikte planlayalım.
          </p>
          <WhatsAppButton className="btn-lg" />
        </div>
      </section>
    </>
  );
}
