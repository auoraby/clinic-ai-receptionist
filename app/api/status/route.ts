import { NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store';

export async function GET() {
  const clinics = clinicStore.getClinics();
  
  return NextResponse.json({
    status: 'OPERATIONAL',
    systemName: 'Clinic AI Receptionist (مستقبل العيادة الذكي)',
    version: '1.0.0',
    serverTime: new Date().toISOString(),
    registeredClinicsCount: clinics.length,
    integrations: {
      metaWhatsAppWebhook: 'ACTIVE',
      googleCalendarSync: 'ACTIVE',
      scheduledRemindersEngine: 'ACTIVE',
      medicalSafeguardFilter: 'ENFORCED',
    },
    activeClinics: clinics.map(c => ({
      name: c.name,
      doctor: c.doctorName,
      whatsappPhoneId: c.whatsappPhoneId,
      status: c.isActive ? 'ONLINE' : 'MAINTENANCE',
    })),
  });
}
