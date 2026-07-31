export interface ClinicData {
  id: string;
  name: string;
  slug: string;
  doctorName: string;
  specialty: string;
  phone: string;
  whatsappPhoneId: string;
  whatsappVerifyToken: string;
  googleCalendarId: string;
  address: string;
  mapsUrl: string;
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  slotDurationMinutes: number;
  bufferTimeMinutes: number;
  avgConsultationMins: number;
  isActive: boolean;
}

export interface UserData {
  id: string;
  clinicId?: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
  phone?: string;
}

export interface PatientData {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  whatsappId: string;
  communicationPref: string;
  notes?: string;
  createdAt: string;
}

export interface AppointmentTypeData {
  id: string;
  clinicId: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface AppointmentData {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentTypeId: string;
  appointmentTypeName: string;
  startDateTime: string;
  endDateTime: string;
  status: 'AWAITING_DETAILS' | 'AWAITING_CONFIRMATION' | 'CONFIRMED' | 'PATIENT_ARRIVED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  googleEventId?: string;
  notes?: string;
}

export interface QueueEntryData {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentId?: string;
  queueNumber: number;
  status: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
  estimatedWaitMinutes: number;
  checkInTime: string;
  notifiedApproaching: boolean;
}

export interface MessageData {
  id: string;
  clinicId: string;
  conversationId: string;
  senderType: 'PATIENT' | 'BOT' | 'STAFF';
  senderName?: string;
  content: string;
  metaMessageId?: string;
  deliveryStatus: 'SCHEDULED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  isMedicalSafeguardRefusal?: boolean;
  createdAt: string;
}

export interface ConversationData {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  isHumanTakeover: boolean;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface MessageTemplateData {
  id: string;
  clinicId: string;
  name: string;
  metaTemplateId: string;
  category: 'CONFIRMATION' | 'REMINDER' | 'QUEUE_ALERT' | 'LOCATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  bodyPattern: string;
}

export interface ReminderJobData {
  id: string;
  clinicId: string;
  appointmentId: string;
  patientName: string;
  reminderType: 'HOURS_24' | 'HOURS_2';
  scheduledTime: string;
  status: 'SCHEDULED' | 'SENT' | 'FAILED' | 'CANCELLED';
  sentAt?: string;
}

export interface AuditLogData {
  id: string;
  clinicId?: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  createdAt: string;
}

export const INITIAL_CLINICS: ClinicData[] = [
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

export const INITIAL_USERS: UserData[] = [
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

export const INITIAL_PATIENTS: PatientData[] = [
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
  },
  {
    id: 'pat-103',
    clinicId: 'clinic-1',
    name: 'أحمد طارق فريد',
    phone: '+201087778899',
    whatsappId: '201087778899',
    communicationPref: 'WHATSAPP',
    notes: 'حجز مبدئي عبر الواتساب الذكي',
    createdAt: '2026-07-31T09:15:00Z',
  },
  {
    id: 'pat-201',
    clinicId: 'clinic-2',
    name: 'هالة مصطفى',
    phone: '+201509998877',
    whatsappId: '201509998877',
    communicationPref: 'WHATSAPP',
    notes: 'حجز فحص شد الجفون بالليزر',
    createdAt: '2026-07-30T14:20:00Z',
  }
];

export const INITIAL_APPOINTMENT_TYPES: AppointmentTypeData[] = [
  {
    id: 'apt-t1',
    clinicId: 'clinic-1',
    name: 'كشف وتأهيل جراحة تجميل',
    description: 'تقييم أولي وشرح التفاصيل قبل العملية',
    durationMinutes: 30,
  },
  {
    id: 'apt-t2',
    clinicId: 'clinic-1',
    name: 'جلسة متابعة بعد العملية',
    description: 'فحص الغرز والتئام الجروح وتغيير الضمادات',
    durationMinutes: 20,
  },
  {
    id: 'apt-t3',
    clinicId: 'clinic-1',
    name: 'حقن بوتوكس وفيلر',
    description: 'إجراء تجميلي سريع غير جراحي',
    durationMinutes: 30,
  },
  {
    id: 'apt-t4',
    clinicId: 'clinic-2',
    name: 'فحص تجميل العيون وحقن البوتوكس',
    description: 'كشف واستشارة طبية دقيقة',
    durationMinutes: 30,
  }
];

export const INITIAL_APPOINTMENTS: AppointmentData[] = [
  {
    id: 'app-001',
    clinicId: 'clinic-1',
    patientId: 'pat-101',
    patientName: 'نورهان صبري',
    patientPhone: '+201201112233',
    appointmentTypeId: 'apt-t3',
    appointmentTypeName: 'حقن بوتوكس وفيلر',
    startDateTime: '2026-07-31T13:00:00Z',
    endDateTime: '2026-07-31T13:30:00Z',
    status: 'IN_CONSULTATION',
    googleEventId: 'goog_evt_101',
    notes: 'تم الدخول للطبيبة الآن',
  },
  {
    id: 'app-002',
    clinicId: 'clinic-1',
    patientId: 'pat-102',
    patientName: 'مريم محمود العوضي',
    patientPhone: '+201145556677',
    appointmentTypeId: 'apt-t2',
    appointmentTypeName: 'جلسة متابعة بعد العملية',
    startDateTime: '2026-07-31T13:30:00Z',
    endDateTime: '2026-07-31T13:50:00Z',
    status: 'PATIENT_ARRIVED',
    googleEventId: 'goog_evt_102',
    notes: 'وصلت للاستقبال وتنتظر دورها',
  },
  {
    id: 'app-003',
    clinicId: 'clinic-1',
    patientId: 'pat-103',
    patientName: 'أحمد طارق فريد',
    patientPhone: '+201087778899',
    appointmentTypeId: 'apt-t1',
    appointmentTypeName: 'كشف وتأهيل جراحة تجميل',
    startDateTime: '2026-07-31T14:30:00Z',
    endDateTime: '2026-07-31T15:00:00Z',
    status: 'CONFIRMED',
    googleEventId: 'goog_evt_103',
    notes: 'تم التأكيد تلقائياً عبر موظف الواتساب الذكي',
  }
];

export const INITIAL_QUEUE: QueueEntryData[] = [
  {
    id: 'q-101',
    clinicId: 'clinic-1',
    patientId: 'pat-101',
    patientName: 'نورهان صبري',
    patientPhone: '+201201112233',
    appointmentId: 'app-001',
    queueNumber: 101,
    status: 'IN_CONSULTATION',
    estimatedWaitMinutes: 0,
    checkInTime: '2026-07-31T12:50:00Z',
    notifiedApproaching: true,
  },
  {
    id: 'q-102',
    clinicId: 'clinic-1',
    patientId: 'pat-102',
    patientName: 'مريم محمود العوضي',
    patientPhone: '+201145556677',
    appointmentId: 'app-002',
    queueNumber: 102,
    status: 'WAITING',
    estimatedWaitMinutes: 10,
    checkInTime: '2026-07-31T13:15:00Z',
    notifiedApproaching: true,
  }
];

export const INITIAL_CONVERSATIONS: ConversationData[] = [
  {
    id: 'conv-101',
    clinicId: 'clinic-1',
    patientId: 'pat-103',
    patientName: 'أحمد طارق فريد',
    patientPhone: '+201087778899',
    isHumanTakeover: false,
    lastMessageText: 'تمام تم اختيار الساعة 2:30 ظهراً لتأكيد الحجز.',
    lastMessageTime: '2026-07-31T10:14:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-102',
    clinicId: 'clinic-1',
    patientId: 'pat-102',
    patientName: 'مريم محمود العوضي',
    patientPhone: '+201145556677',
    isHumanTakeover: true,
    lastMessageText: 'مرحباً، أرسلت صورة للأنف وأريد سؤال الدكتورة هل الورم طبيعي؟',
    lastMessageTime: '2026-07-31T11:45:00Z',
    unreadCount: 1,
  }
];

export const INITIAL_MESSAGES: MessageData[] = [
  {
    id: 'msg-01',
    clinicId: 'clinic-1',
    conversationId: 'conv-101',
    senderType: 'PATIENT',
    senderName: 'أحمد طارق',
    content: 'السلام عليكم، عاوز أحجز كشف تجميل',
    deliveryStatus: 'READ',
    createdAt: '2026-07-31T10:10:00Z',
  },
  {
    id: 'msg-02',
    clinicId: 'clinic-1',
    conversationId: 'conv-101',
    senderType: 'BOT',
    senderName: 'مستقبل العيادة الذكي',
    content: 'أهلاً بك في عيادة التجميل الدقيق - د. سارة الشريف! يسعدنا خدمتك.\nما نوع الخدمة المطلوبة؟\n1. كشف وتأهيل جراحة تجميل\n2. متابعة بعد العملية\n3. حقن بوتوكس وفيلر',
    deliveryStatus: 'READ',
    createdAt: '2026-07-31T10:11:00Z',
  },
  {
    id: 'msg-03',
    clinicId: 'clinic-1',
    conversationId: 'conv-101',
    senderType: 'PATIENT',
    senderName: 'أحمد طارق',
    content: 'عاوز كشف وتأهيل، المواعيد المتاحة النهاردة كام؟',
    deliveryStatus: 'READ',
    createdAt: '2026-07-31T10:12:00Z',
  },
  {
    id: 'msg-04',
    clinicId: 'clinic-1',
    conversationId: 'conv-101',
    senderType: 'BOT',
    senderName: 'مستقبل العيادة الذكي',
    content: 'المواعيد المتاحة اليوم:\n• 02:30 ظهراً\n• 04:00 عصراً\n• 06:30 مساءً\nمن فضلك اختر الموعد المناسب لك.',
    deliveryStatus: 'READ',
    createdAt: '2026-07-31T10:13:00Z',
  },
  {
    id: 'msg-05',
    clinicId: 'clinic-1',
    conversationId: 'conv-101',
    senderType: 'PATIENT',
    senderName: 'أحمد طارق',
    content: 'اختار 2:30 ظهراً',
    deliveryStatus: 'READ',
    createdAt: '2026-07-31T10:14:00Z',
  },
  {
    id: 'msg-06',
    clinicId: 'clinic-1',
    conversationId: 'conv-101',
    senderType: 'BOT',
    senderName: 'مستقبل العيادة الذكي',
    content: 'تم تأكيد حجزك بنجاح! 🎉\n👤 الاسم: أحمد طارق فريد\n🗓 الموعد: اليوم الساعة 02:30 ظهراً\n📍 العنوان: التجمع الخامس - مركز كير الطبي\nسنرسل لك تذكيراً قبل الموعد.',
    deliveryStatus: 'DELIVERED',
    createdAt: '2026-07-31T10:15:00Z',
  },
  // Medical Safeguard Example:
  {
    id: 'msg-07',
    clinicId: 'clinic-1',
    conversationId: 'conv-102',
    senderType: 'PATIENT',
    senderName: 'مريم محمود',
    content: 'مرحباً، أرسلت صورة للأنف وأشعر بألم شديد، ما العلاج أو المرهم الذي أستخدمه؟',
    deliveryStatus: 'READ',
    createdAt: '2026-07-31T11:44:00Z',
  },
  {
    id: 'msg-08',
    clinicId: 'clinic-1',
    conversationId: 'conv-102',
    senderType: 'BOT',
    senderName: 'مستقبل العيادة الذكي (الحماية الطبية)',
    content: 'عفواً، بصفتي مساعداً إدارياً آلياً، لا يمكنني تقديم استشارات طبية، تشخيص حالات، أو التوصية بأدوية حفاظاً على سلامتك.\nتم تحويل المحادثة فوراً للفريق الطبي وموظف الاستقبال لمراجعة حالتك والرد عليك في أقرب وقت.',
    deliveryStatus: 'DELIVERED',
    isMedicalSafeguardRefusal: true,
    createdAt: '2026-07-31T11:45:00Z',
  }
];

export const INITIAL_TEMPLATES: MessageTemplateData[] = [
  {
    id: 'tmpl-1',
    clinicId: 'clinic-1',
    name: 'تأكيد الحجز الفوري',
    metaTemplateId: 'booking_confirmation_v1',
    category: 'CONFIRMATION',
    language: 'ar',
    status: 'APPROVED',
    bodyPattern: 'مرحباً {{1}}، تم تأكيد حجزك في {{2}} موعد {{3}}. عنوان العيادة: {{4}}.',
  },
  {
    id: 'tmpl-2',
    clinicId: 'clinic-1',
    name: 'تذكير قبل الموعد بـ 24 ساعة',
    metaTemplateId: 'reminder_24h_v1',
    category: 'REMINDER',
    language: 'ar',
    status: 'APPROVED',
    bodyPattern: 'نذكركم بموعدكم غداً {{1}} الساعة {{2}} مع {{3}}. لتأكيد الحضور أرسل 1، للتأجيل أرسل 2.',
  },
  {
    id: 'tmpl-3',
    clinicId: 'clinic-1',
    name: 'تنبيه اقتراب الدور والطابور',
    metaTemplateId: 'queue_approaching_v1',
    category: 'QUEUE_ALERT',
    language: 'ar',
    status: 'APPROVED',
    bodyPattern: 'دورك اقترب (رقم {{1}})، من فضلك توجّه إلى العيادة الآن.',
  }
];

export const INITIAL_REMINDER_JOBS: ReminderJobData[] = [
  {
    id: 'rem-1',
    clinicId: 'clinic-1',
    appointmentId: 'app-003',
    patientName: 'أحمد طارق فريد',
    reminderType: 'HOURS_2',
    scheduledTime: '2026-07-31T12:30:00Z',
    status: 'SCHEDULED',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogData[] = [
  {
    id: 'log-1',
    clinicId: 'clinic-1',
    userName: 'منى أحمد (استقبال)',
    userRole: 'RECEPTIONIST',
    action: 'CHECKIN_PATIENT',
    details: 'تسجيل وصول المريضة مريم محمود وتوليد رقم الطابور Q-102',
    createdAt: '2026-07-31T13:15:00Z',
  },
  {
    id: 'log-2',
    clinicId: 'clinic-1',
    userName: 'منى أحمد (استقبال)',
    userRole: 'RECEPTIONIST',
    action: 'HUMAN_TAKEOVER_ENABLE',
    details: 'تفعيل التدخل البشري لمحادثة المريضة مريم محمود بسبب استفسار طبي حساس',
    createdAt: '2026-07-31T11:46:00Z',
  }
];
