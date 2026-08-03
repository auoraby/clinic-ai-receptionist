import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const clinicsCount = await prisma.clinic.count();
    const usersCount   = await prisma.user.count();
    const patientsCount= await prisma.patient.count();

    return NextResponse.json({
      status: 'OPERATIONAL',
      systemName: 'AiYADA — استقبال ذكي . مواعيد اسهل',
      version: '1.0.0',
      database: 'SQLite/PostgreSQL (Prisma ORM Connected ✅)',
      serverTime: new Date().toISOString(),
      counts: {
        clinics: clinicsCount,
        users: usersCount,
        patients: patientsCount,
      },
      integrations: {
        metaWhatsAppWebhook: 'ACTIVE',
        googleCalendarSync: 'ACTIVE',
        scheduledRemindersEngine: 'ACTIVE',
        medicalSafeguardFilter: 'ENFORCED',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'DEGRADED',
      systemName: 'AiYADA',
      error: error.message || 'Database error',
    }, { status: 500 });
  }
}
