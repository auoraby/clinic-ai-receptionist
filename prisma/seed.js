const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INITIAL_CLINICS = [
  {
    id: 'clinic-1',
    name: 'عيادة التجميل الدقيق - د. سارة الشريف',
    slug: 'dr-sara-plastic',
    doctorName: 'أ.د. سارة الشريف',
    specialty: 'استشاري جراحة التجميل والحروق والتجميل الأنثوي',
    phone: '+201012345678',
    whatsappPhoneId: '1098765432101',
    whatsappVerifyToken: 'clinic_ai_secret_verify_token_2026',
    googleCalendarId: 'sara.clinic.calendar@gmail.com',
    address: 'القاهرة التجمع الخامس - شارع التسعين الشمالي - مركز كير الطبي - الدور الثالث',
    mapsUrl: 'https://maps.google.com/?q=New+Cairo+Care+Medical',
    workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    workingHoursStart: '12:00',
    workingHoursEnd: '20:00',
    slotDurationMinutes: 30,
    bufferTimeMinutes: 10,
    avgConsultationMins: 20,
    isActive: true,
  },
  {
    id: 'clinic-2',
    name: 'مركز د. كريم زكي لطب وجراحة العيون والتجميل',
    slug: 'dr-kareem-eyecare',
    doctorName: 'د. كريم زكي',
    specialty: 'استشاري تجميل العيون وحقن الفيلر والبوتوكس',
    phone: '+201098765432',
    whatsappPhoneId: '1098765432102',
    whatsappVerifyToken: 'clinic_ai_secret_verify_token_2026',
    googleCalendarId: 'kareem.clinic.calendar@gmail.com',
    address: 'الجيزة الشيخ زايد - الأرجوان سنتر - الدور الثاني',
    mapsUrl: 'https://maps.google.com/?q=Sheikh+Zayed+Arjowan',
    workingDays: ['Saturday', 'Sunday', 'Tuesday', 'Wednesday'],
    workingHoursStart: '14:00',
    workingHoursEnd: '21:00',
    slotDurationMinutes: 30,
    bufferTimeMinutes: 15,
    avgConsultationMins: 25,
    isActive: true,
  }
];

const INITIAL_USERS = [
  {
    id: 'usr-admin',
    email: 'admin@clinicai.com',
    name: 'المهندس مدير النظام',
    role: 'SUPER_ADMIN',
    phone: '+201000000000',
  },
  {
    id: 'usr-doc1',
    clinicId: 'clinic-1',
    email: 'dr.sara@clinicai.com',
    name: 'أ.د. سارة الشريف',
    role: 'DOCTOR',
    phone: '+201012345678',
  },
  {
    id: 'usr-rec1',
    clinicId: 'clinic-1',
    email: 'rec.mona@clinicai.com',
    name: 'منى أحمد (استقبال)',
    role: 'RECEPTIONIST',
    phone: '+201011112222',
  },
  {
    id: 'usr-doc2',
    clinicId: 'clinic-2',
    email: 'dr.kareem@clinicai.com',
    name: 'د. كريم زكي',
    role: 'DOCTOR',
    phone: '+201098765432',
  }
];

const INITIAL_PATIENTS = [
  {
    id: 'pat-101',
    clinicId: 'clinic-1',
    name: 'نورهان صبري',
    phone: '+201201112233',
    whatsappId: '201201112233',
    communicationPref: 'WHATSAPP',
    notes: 'تفضل المواعيد المسائية بعد الساعة 4 مساءً',
    createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'pat-102',
    clinicId: 'clinic-1',
    name: 'مريم محمود العوضي',
    phone: '+201145556677',
    whatsappId: '201145556677',
    communicationPref: 'WHATSAPP',
    notes: 'استشارة إعادة تقييم بعد عملية تجميل الأنف',
    createdAt: '2026-07-22T11:30:00Z',
  }
];

async function main() {
  console.log('🌱 Seeding AiYADA database via Prisma...');

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

  for (const u of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        clinicId: u.clinicId || null,
        email: u.email,
        passwordHash: 'password123',
        name: u.name,
        role: u.role,
        phone: u.phone,
      },
    });
  }

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

  console.log('✅ AiYADA database successfully seeded!');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
