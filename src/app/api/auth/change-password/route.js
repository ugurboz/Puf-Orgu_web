import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { currentPassword, newPassword } = await request.json();

        // 1. Get current admin (assuming single admin 'admin')
        const admin = await prisma.admin.findUnique({
            where: { username: 'admin' },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin kullanıcısı bulunamadı' }, { status: 404 });
        }

        // 2. Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, admin.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 401 });
        }

        // 3. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update password
        await prisma.admin.update({
            where: { username: 'admin' },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: 'Şifre başarıyla güncellendi' });

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({ error: 'Şifre değiştirilirken bir hata oluştu' }, { status: 500 });
    }
}
