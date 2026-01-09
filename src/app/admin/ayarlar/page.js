'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminSettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuth');
        if (!isAuth) {
            router.push('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler eşleşmiyor.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Optional: Logout after password change
                // setTimeout(() => {
                //     handleLogout();
                // }, 2000);
            } else {
                setError(data.error || 'Bir hata oluştu.');
            }
        } catch (err) {
            setError('Bağlantı hatası.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar onLogout={handleLogout} />
            <div className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Ayarlar</h1>
                </div>

                <div className="card" style={{ maxWidth: '600px', padding: '32px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Şifre Değiştir</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Mevcut Şifre</label>
                            <input
                                type="password"
                                className="form-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Yeni Şifre</label>
                            <input
                                type="password"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {message && (
                            <div className="alert alert-success" style={{
                                padding: '12px',
                                background: 'rgba(37, 211, 102, 0.1)',
                                color: 'var(--color-whatsapp-dark)',
                                borderRadius: '8px',
                                marginBottom: '16px'
                            }}>
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error" style={{
                                padding: '12px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '8px',
                                marginBottom: '16px'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
