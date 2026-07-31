import { ClinicData } from '../mock-data';
import { clinicStore } from '../store';

export interface BotProcessResult {
  replyText: string;
  isMedicalSafeguardRefusal: boolean;
  intent: 'BOOKING' | 'LOCATION' | 'HOURS' | 'SERVICES' | 'CANCEL_RESCHEDULE' | 'HUMAN_REQUEST' | 'MEDICAL_QUERY' | 'GENERAL';
  actionTaken?: string;
}

// Medical keywords trigger strict refusal & transfer to clinic staff
const MEDICAL_SYMPTOM_KEYWORDS = [
  'علاج', 'دواء', 'مرهم', 'مضاد', 'ألم', 'شديد', 'ورم', 'نزيف', 'التهاب', 'جرح', 'عفونة',
  'تشخيص', 'صورة', 'حرارة', 'سخونية', 'طوارئ', 'أعراض', 'وصفة', 'روشتة', 'نتيجة تحليل',
  'أستفسر عن حالة', 'هل العملية تنجح', 'ضمان للعملية'
];

// Keywords for intents
const BOOKING_KEYWORDS = ['حجز', 'احجز', 'موعد', 'عاوز اجي', 'عاوزة اجي', 'اريد حجز', 'ميعاد', 'كشف'];
const LOCATION_KEYWORDS = ['عنوان', 'فين', 'مكان', 'موقع', 'ماب', 'خرائط', 'لوكيشن'];
const HOURS_KEYWORDS = ['مواعيد', 'شغالين', 'بتفتحوا', 'الساعة كام', 'ايام العمل', 'ساعات العمل'];
const HUMAN_KEYWORDS = ['كلم دكتور', 'بشري', 'انسان', 'استقبال', 'موظف', 'خدمة عملاء'];
const CANCEL_KEYWORDS = ['الغاء', 'الغي', 'أغيّر', 'تأجيل', 'تغيير الموعد'];

export function processPatientMessage(
  clinic: ClinicData,
  patientPhone: string,
  patientName: string,
  messageText: string
): BotProcessResult {
  const normalizedText = messageText.trim().toLowerCase();

  // 1. Strict Medical Safeguard Inspection
  const isMedicalQuery = MEDICAL_SYMPTOM_KEYWORDS.some(kw => normalizedText.includes(kw));
  if (isMedicalQuery) {
    const refusalReply = 
      `عفواً، بصفتي مساعداً إدارياً آلياً، لا يمكنني تقديم استشارات طبية، تشخيص حالات، أو التوصية بأدوية حفاظاً على سلامتك الصحّية.\n\n` +
      `تم تحويل هذه المحادثة فوراً إلى الطاقم الطبي بمكتب ${clinic.doctorName} لمراجعة رسالتك والرد عليك في أقرب وقت. 🩺`;

    return {
      replyText: refusalReply,
      isMedicalSafeguardRefusal: true,
      intent: 'MEDICAL_QUERY',
      actionTaken: 'TRANSFER_TO_HUMAN_MEDICAL_TRIGGER',
    };
  }

  // 2. Human Request
  if (HUMAN_KEYWORDS.some(kw => normalizedText.includes(kw))) {
    return {
      replyText: `تم تحويل المحادثة لموظف الاستقبال في ${clinic.name}. سيتواصل معك أحد ممثلي الخدمة قريباً جداً.`,
      isMedicalSafeguardRefusal: false,
      intent: 'HUMAN_REQUEST',
      actionTaken: 'TRANSFER_TO_HUMAN',
    };
  }

  // 3. Location Query
  if (LOCATION_KEYWORDS.some(kw => normalizedText.includes(kw))) {
    const mapsLinkText = clinic.mapsUrl ? `\n📍 رابط Google Maps:\n${clinic.mapsUrl}` : '';
    return {
      replyText: `📌 عنوان ${clinic.name}:\n${clinic.address}${mapsLinkText}`,
      isMedicalSafeguardRefusal: false,
      intent: 'LOCATION',
    };
  }

  // 4. Working Hours Query
  if (HOURS_KEYWORDS.some(kw => normalizedText.includes(kw))) {
    const daysAr = clinic.workingDays.map(translateDay).join(' - ');
    return {
      replyText: `⏰ مواعيد العمل في ${clinic.name}:\n` +
                 `• أيام العمل: ${daysAr}\n` +
                 `• ساعات العمل: من ${clinic.workingHoursStart} إلى ${clinic.workingHoursEnd}`,
      isMedicalSafeguardRefusal: false,
      intent: 'HOURS',
    };
  }

  // 5. Cancel or Reschedule Query
  if (CANCEL_KEYWORDS.some(kw => normalizedText.includes(kw))) {
    return {
      replyText: `لتأجيل أو إلغاء حجزك، يرجى كتابة اسمك ورقم الموعد المراد تعديله، وسيقوم موظف الاستقبال بتعديل حجزك فوراً. يمكنك أيضاً اختيار موعد جديد.`,
      isMedicalSafeguardRefusal: false,
      intent: 'CANCEL_RESCHEDULE',
    };
  }

  // 6. Booking Intent Handling
  if (BOOKING_KEYWORDS.some(kw => normalizedText.includes(kw)) || normalizedText === '1' || normalizedText === '2' || normalizedText === '3') {
    const types = clinicStore.getAppointmentTypes(clinic.id);
    const typesList = types.map((t, idx) => `${idx + 1}. ${t.name}`).join('\n');

    // Check if slot selected
    if (normalizedText.includes('2:30') || normalizedText.includes('02:30') || normalizedText.includes('الساعة 2')) {
      // Auto confirm demo appointment
      const type = types[0] || { id: 'apt-t1', name: 'كشف وتأهيل' };
      const startDateTime = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
      const endDateTime = new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString();

      let pat = clinicStore.getPatients(clinic.id).find(p => p.phone === patientPhone);
      if (!pat) {
        pat = clinicStore.addPatient(clinic.id, patientName, patientPhone);
      }

      clinicStore.addAppointment({
        clinicId: clinic.id,
        patientId: pat.id,
        patientName: pat.name,
        patientPhone: pat.phone,
        appointmentTypeId: type.id,
        appointmentTypeName: type.name,
        startDateTime,
        endDateTime,
        status: 'CONFIRMED',
        notes: 'حجز آلي مؤكد عبر الواتساب',
      });

      return {
        replyText: `تم تأكيد حجزك بنجاح! 🎉\n\n` +
                   `👤 الاسم: ${patientName}\n` +
                   `👩‍⚕️ الطبيب: ${clinic.doctorName}\n` +
                   `🗓 الموعد: اليوم الساعة 02:30 ظهراً\n` +
                   `📍 العنوان: ${clinic.address}\n\n` +
                   `تم مزامنة الموعد مع التقويم وإرسال التذكيرات. ننتظر حضوركم بكل ترحيب!`,
        isMedicalSafeguardRefusal: false,
        intent: 'BOOKING',
        actionTaken: 'CREATE_CONFIRMED_APPOINTMENT',
      };
    }

    // Propose available slots
    return {
      replyText: `أهلاً بك في ${clinic.name} (${clinic.doctorName})! 🏥\n\n` +
                 `الخدمات المتاحة للحجز:\n${typesList}\n\n` +
                 `🗓 المواعيد المقترحة المتاحة اليوم:\n` +
                 `• 02:30 ظهراً\n` +
                 `• 04:30 عصراً\n` +
                 `• 06:00 مساءً\n\n` +
                 `اختر الموعد المناسب بكتابة وقت الموعد (مثال: "اختار 02:30").`,
      isMedicalSafeguardRefusal: false,
      intent: 'BOOKING',
    };
  }

  // 7. Default Welcome & Menu
  return {
    replyText: `مرحباً بك في ${clinic.name} (${clinic.doctorName})! 👋\n` +
               `أنا المساعد الآلي لخدمة المواعيد والاستفسارات الإدارية.\n\n` +
               `كيف يمكنني مساعدتك اليوم؟\n` +
               `1. 📅 حجز موعد جديد\n` +
               `2. ⏰ الاستفسار عن مواعيد العمل\n` +
               `3. 📍 موقع وعنوان العيادة\n` +
               `4. 👤 التحدث مع موظف الاستقبال`,
    isMedicalSafeguardRefusal: false,
    intent: 'GENERAL',
  };
}

function translateDay(day: string): string {
  const map: Record<string, string> = {
    Sunday: 'الأحد',
    Monday: 'الإثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
  };
  return map[day] || day;
}
