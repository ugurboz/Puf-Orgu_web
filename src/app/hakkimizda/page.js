import Link from 'next/link';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
    title: 'Hakkımızda - Puf Örgü',
    description: 'Puf Örgü\'nün hikayesi. El emeği, göz nuru örgü tasarımlarımızı sevgiyle üretiyoruz.',
};

export default function AboutPage() {
    return (
        <div className="about-page">
            {/* Hero */}
            <div className="about-hero" style={{ background: 'var(--color-beige)' }}>
                <div className="container">
                    <h1>Hakkımızda</h1>
                    <p>
                        El sanatlarına olan tutkumuzla, evinize sıcaklık katacak
                        benzersiz örgü ürünleri üretiyoruz.
                    </p>
                </div>
            </div>

            {/* Story */}
            <section className="section">
                <div className="container">
                    <div className="about-content">
                        <div className="about-image">
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '4/3',
                                    background: 'linear-gradient(135deg, #D4A574 0%, #C4A484 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '100px'
                                }}
                            >
                                🧶
                            </div>
                        </div>
                        <div className="about-text">
                            <h2>Hikayemiz</h2>
                            <p>
                                Puf Örgü, el sanatlarına olan derin bir tutkudan doğdu. Yıllar önce
                                annemden öğrendiğim örgü sanatını, modern tasarımlarla buluşturarak
                                bu yolculuğa başladım.
                            </p>
                            <p>
                                Her ürünümüz, geleneksel örgü tekniklerinin çağdaş estetiğiyle
                                harmanlanan bir sevgi emeğidir. İlmek ilmek, düğüm düğüm işlenen
                                her parça, evinize benzersiz bir sıcaklık ve karakter katar.
                            </p>
                            <p>
                                En kaliteli doğal iplikleri kullanarak, zamana dayanıklı ve
                                çevre dostu ürünler üretmeyi ilke edindik. Sizin için özel
                                tasarımlar yaparak, hayalinizdeki parçayı gerçeğe dönüştürüyoruz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section values-section">
                <div className="container">
                    <h2 className="section-title">Değerlerimiz</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                            <h3>Sevgiyle Üretim</h3>
                            <p>
                                Her ürünümüz sevgi ve özenle, el emeği ile üretilmektedir.
                                Her ilmekte kalbimizi koyuyoruz.
                            </p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <h3>Kalite Garantisi</h3>
                            <p>
                                En kaliteli doğal iplikleri kullanarak, uzun ömürlü ve
                                dayanıklı ürünler üretiyoruz.
                            </p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                    <line x1="9" y1="9" x2="9.01" y2="9" />
                                    <line x1="15" y1="9" x2="15.01" y2="9" />
                                </svg>
                            </div>
                            <h3>Müşteri Memnuniyeti</h3>
                            <p>
                                Sizin mutluluğunuz bizim önceliğimiz. Her siparişte
                                beklentilerinizi aşmayı hedefliyoruz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="section" style={{ background: 'var(--color-beige)' }}>
                <div className="container">
                    <div className="about-content" style={{ alignItems: 'center' }}>
                        <div className="about-text">
                            <h2>Misyonumuz</h2>
                            <p>
                                Geleneksel el sanatlarını yaşatarak, her eve özgün ve kaliteli
                                örgü ürünleri sunmak. Müşterilerimizle birlikte, onların
                                hayallerindeki parçaları gerçeğe dönüştürmek.
                            </p>
                            <p>
                                Sürdürülebilir üretim anlayışıyla, doğal malzemeler kullanarak
                                çevreye duyarlı ürünler ortaya koymak ve el sanatlarının değerini
                                yeni nesillere aktarmak.
                            </p>
                            <WhatsAppButton className="btn-lg" style={{ marginTop: '24px' }} />
                        </div>
                        <div className="about-image">
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    background: 'linear-gradient(135deg, #C4A484 0%, #8B6914 100%)',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '80px'
                                }}
                            >
                                ✨
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
