'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, categories: 0, featured: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check auth
        const isAuth = localStorage.getItem('adminAuth');
        if (!isAuth) {
            router.push('/admin/login');
            return;
        }

        // Load stats
        loadStats();
    }, [router]);

    const loadStats = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            const products = data.products || [];

            setStats({
                products: products.length,
                categories: [...new Set(products.map(p => p.category))].length,
                featured: products.filter(p => p.featured).length,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
    };

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
                    <h1 className="admin-title">Dashboard</h1>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Toplam Ürün</h3>
                        <div className="stat-value">{stats.products}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Kategori</h3>
                        <div className="stat-value">{stats.categories}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Öne Çıkan</h3>
                        <div className="stat-value">{stats.featured}</div>
                    </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ marginBottom: '16px' }}>Hızlı İşlemler</h2>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Link href="/admin/urunler" className="btn btn-primary">
                            Ürünleri Yönet
                        </Link>
                        <Link href="/admin/urunler/new" className="btn btn-outline">
                            Yeni Ürün Ekle
                        </Link>
                        <Link href="/admin/ayarlar" className="btn btn-outline">
                            Ayarlar / Şifre Değiştir
                        </Link>
                        <Link href="/" className="btn btn-outline" target="_blank">
                            Siteyi Görüntüle
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
