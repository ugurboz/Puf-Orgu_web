'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductEditPage() {
    const params = useParams();
    const router = useRouter();
    const isNew = params.id === 'new';
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        longDescription: '',
        price: '',
        category: 'bereler',
        material: '',
        dimensions: '',
        colors: '',
        featured: false,
        inStock: true,
        images: [],
    });

    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuth');
        if (!isAuth) {
            router.push('/admin/login');
            return;
        }

        loadCategories();
        if (!isNew) {
            loadProduct();
        }
    }, [router, isNew, params.id]);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadProduct = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            const product = data.products?.find((p) => p.id === params.id);

            if (product) {
                setFormData({
                    name: product.name || '',
                    slug: product.slug || '',
                    description: product.description || '',
                    longDescription: product.longDescription || '',
                    price: product.price !== undefined ? product.price : '',
                    category: product.category || 'bereler',
                    material: product.specifications?.material || '',
                    dimensions: product.specifications?.dimensions || '',
                    colors: product.specifications?.colors?.join(', ') || '',
                    featured: product.featured || false,
                    inStock: product.inStock !== undefined ? product.inStock : true,
                    images: product.images || [],
                });
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const uploadedUrls = [];

            for (const file of files) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                if (res.ok) {
                    const data = await res.json();
                    uploadedUrls.push(data.url);
                } else {
                    const error = await res.json();
                    alert(error.error || 'Görsel yüklenemedi');
                }
            }

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls],
            }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Görsel yükleme hatası');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                longDescription: formData.longDescription,
                price: formData.price !== '' ? Number(formData.price) : 0,
                category: formData.category,
                specifications: {
                    material: formData.material,
                    dimensions: formData.dimensions,
                    colors: formData.colors
                        .split(',')
                        .map((c) => c.trim())
                        .filter(Boolean),
                },
                featured: formData.featured,
                inStock: formData.inStock,
                images: formData.images,
            };

            if (!isNew) {
                productData.id = params.id;
            }

            const res = await fetch('/api/products', {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push('/admin/urunler');
            } else {
                alert('Ürün kaydedilemedi');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
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
                    <h1 className="admin-title">{isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}</h1>
                    <Link href="/admin/urunler" className="btn btn-outline">
                        ← Geri Dön
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    {/* Image Upload Section */}
                    <div className="form-group">
                        <label className="form-label">Ürün Görselleri</label>
                        <div
                            style={{
                                border: '2px dashed var(--color-beige-dark)',
                                borderRadius: '12px',
                                padding: '24px',
                                textAlign: 'center',
                                backgroundColor: 'var(--color-beige)',
                                marginBottom: '16px',
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                style={{
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    display: 'block',
                                }}
                            >
                                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📷</div>
                                <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
                                    {uploading ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın'}
                                </p>
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                    JPG, PNG veya WebP (Maks. 5MB)
                                </p>
                            </label>
                        </div>

                        {/* Image Preview */}
                        {formData.images.length > 0 && (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '12px',
                                }}
                            >
                                {formData.images.map((img, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: 'relative',
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '1px solid var(--color-beige-dark)',
                                        }}
                                    >
                                        <Image src={img} alt={`Görsel ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: 'rgba(220, 38, 38, 0.9)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">
                                Ürün Adı *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="Örn: El Örgüsü Bere"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="slug">
                                URL Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                className="form-input"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="el-orgusu-bere"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="category">
                                Kategori *
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="form-input"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">&nbsp;</label>
                            <div className="form-checkbox" style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    id="featured"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <label htmlFor="featured">Öne Çıkan Ürün</label>
                            </div>
                            <div className="form-checkbox" style={{ height: '48px', display: 'flex', alignItems: 'center', marginLeft: '24px' }}>
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    name="inStock"
                                    checked={formData.inStock}
                                    onChange={handleChange}
                                />
                                <label htmlFor="inStock">Stokta Var</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="price">
                            Fiyat (₺)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            className="form-input"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Örn: 499"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">
                            Kısa Açıklama *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-input form-textarea"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Ürünün kısa açıklaması (ürün kartlarında görünecek)"
                            required
                            style={{ minHeight: '80px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="longDescription">
                            Detaylı Açıklama
                        </label>
                        <textarea
                            id="longDescription"
                            name="longDescription"
                            className="form-input form-textarea"
                            value={formData.longDescription}
                            onChange={handleChange}
                            placeholder="Ürünün detaylı açıklaması (ürün detay sayfasında görünecek)"
                            style={{ minHeight: '120px' }}
                        />
                    </div>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Ürün Özellikleri</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="material">
                                Malzeme
                            </label>
                            <input
                                type="text"
                                id="material"
                                name="material"
                                className="form-input"
                                value={formData.material}
                                onChange={handleChange}
                                placeholder="Örn: Pamuk ip"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="dimensions">
                                Ölçüler
                            </label>
                            <input
                                type="text"
                                id="dimensions"
                                name="dimensions"
                                className="form-input"
                                value={formData.dimensions}
                                onChange={handleChange}
                                placeholder="Örn: S, M, L"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="colors">
                            Renkler (virgülle ayırın)
                        </label>
                        <input
                            type="text"
                            id="colors"
                            name="colors"
                            className="form-input"
                            value={formData.colors}
                            onChange={handleChange}
                            placeholder="Örn: Bej, Krem, Beyaz"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Kaydediliyor...' : isNew ? 'Ürün Ekle' : 'Değişiklikleri Kaydet'}
                        </button>
                        <Link href="/admin/urunler" className="btn btn-outline">
                            İptal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AdminSidebar({ onLogout }) {
    return (
        <aside className="admin-sidebar">
            <div className="admin-logo">
                <span style={{ marginRight: '8px' }}>🧶</span>
                Puf Örgü
            </div>
            <nav className="admin-nav">
                <Link href="/admin" className="admin-nav-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                </Link>
                <Link href="/admin/urunler" className="admin-nav-link active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    Ürünler
                </Link>
                <Link href="/" className="admin-nav-link" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Siteyi Görüntüle
                </Link>
                <button onClick={onLogout} className="admin-nav-link" style={{ width: '100%', textAlign: 'left' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Çıkış Yap
                </button>
            </nav>
        </aside>
    );
}
