import { PrismaClient } from '@prisma/client';
import {
  INITIAL_CLINICS,
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENT_TYPES,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_TEMPLATES,
  INITIAL_AUDIT_LOGS,
} from '../lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AiYADA database seeding...');

  // Seed Clinics
  for (const c of INITIAL_CLINICS) {
    await prisma.clinic.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        doctorName: c.doctorName,
        specialty: c.specialty,
        phone: c.phone,
        whatsappPhoneId: c.whatsappPhoneId,
        whatsappVerifyToken: c.whatsappVerifyToken,
        googleCalendarId: c.googleCalendarId,
        address: c.address,
        mapsUrl: c.mapsUrl,
        workingDaysJson: JSON.stringify(c.workingDays),
        workingHoursStart: c.workingHoursStart,
        workingHoursEnd: c.workingHoursEnd,
        slotDurationMinutes: c.slotDurationMinutes,
        bufferTimeMinutes: c.bufferTimeMinutes,
        avgConsultationMins: c.avgConsultationMins,
        isActive: c.isActive,
      },
    });
  }

  // Seed Users
  for (const u of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        clinicId: u.clinicId || null,
        email: u.email,
        passwordHash: 'password123', // Demo password
        name: u.name,
        role: u.role,
        phone: u.phone,
      },
    });
  }

  // Seed Patients
  for (const p of INITIAL_PATIENTS) {
    await prisma.patient.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        clinicId: p.clinicId,
        name: p.name,
        phone: p.phone,
        whatsappId: p.whatsappId,
        communicationPref: p.communicationPref,
        notes: p.notes,
        createdAt: new Date(p.createdAt),
      },
    });
  }

  // Seed Appointment Types
  for (const t of INITIAL_APPOINTMENT_TYPES) {
    await prisma.appointmentType.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        clinicId: t.clinicId,
        name: t.name,
        description: t.description,
        durationMinutes: t.durationMinutes,
      },
    });
  }

  // Seed Appointments
  for (const a of INITIAL_APPOINTMENTS) {
    await prisma.appointment.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        clinicId: a.clinicId,
        patientId: a.patientId,
        appointmentTypeId: a.appointmentTypeId,
        startDateTime: new Date(a.startDateTime),
        endDateTime: new Date(a.endDateTime),
        status: a.status,
        googleEventId: a.googleEventId,
        notes: a.notes,
      },
    });
  }

  // Seed Message Templates
  for (const tmpl of INITIAL_TEMPLATES) {
    await prisma.messageTemplate.upsert({
      where: { id: tmpl.id },
      update: {},
      create: {
        id: tmpl.id,
        clinicId: tmpl.clinicId,
        name: tmpl.name,
        metaTemplateId: tmpl.metaTemplateId,
        category: tmpl.category,
        language: tmpl.language,
        status: tmpl.status,
        bodyPattern: tmpl.bodyPattern,
      },
    });
  }

  console.log('✅ AiYADA database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
