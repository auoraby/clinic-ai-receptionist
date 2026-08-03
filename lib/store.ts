import {
  ClinicData,
  UserData,
  PatientData,
  AppointmentTypeData,
  AppointmentData,
  QueueEntryData,
  MessageData,
  ConversationData,
  MessageTemplateData,
  ReminderJobData,
  AuditLogData,
  INITIAL_CLINICS,
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENT_TYPES,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_TEMPLATES,
  INITIAL_REMINDER_JOBS,
  INITIAL_AUDIT_LOGS,
} from './mock-data';

class ClinicStore {
  private clinics: ClinicData[] = [...INITIAL_CLINICS];
  private users: UserData[] = [...INITIAL_USERS];
  private patients: PatientData[] = [...INITIAL_PATIENTS];
  private appointmentTypes: AppointmentTypeData[] = [...INITIAL_APPOINTMENT_TYPES];
  private appointments: AppointmentData[] = [...INITIAL_APPOINTMENTS];
  private queue: QueueEntryData[] = [...INITIAL_QUEUE];
  private conversations: ConversationData[] = [...INITIAL_CONVERSATIONS];
  private messages: MessageData[] = [...INITIAL_MESSAGES];
  private templates: MessageTemplateData[] = [...INITIAL_TEMPLATES];
  private reminderJobs: ReminderJobData[] = [...INITIAL_REMINDER_JOBS];
  private auditLogs: AuditLogData[] = [...INITIAL_AUDIT_LOGS];

  // Clinics
  getClinics() {
    return this.clinics;
  }

  getClinicById(id: string) {
    return this.clinics.find(c => c.id === id) || this.clinics[0];
  }

  getClinicByPhoneId(phoneId: string) {
    return this.clinics.find(c => c.whatsappPhoneId === phoneId) || this.clinics[0];
  }

  addClinic(data: Omit<ClinicData, 'id'>) {
    const newClinic: ClinicData = {
      ...data,
      id: `clinic-${Date.now()}`,
    };
    this.clinics.push(newClinic);
    this.logAudit(newClinic.id, 'المدير العام', 'SUPER_ADMIN', 'ADD_CLINIC', `إضافة عيادة جديدة: ${newClinic.name}`);
    return newClinic;
  }

  updateClinic(id: string, updates: Partial<ClinicData>) {
    const idx = this.clinics.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.clinics[idx] = { ...this.clinics[idx], ...updates };
      this.logAudit(id, 'مدير العيادة', 'DOCTOR', 'UPDATE_CLINIC_SETTINGS', `تحديث إعدادات العيادة`);
      return this.clinics[idx];
    }
    return null;
  }

  // Users & Auth
  getUsers() {
    return this.users;
  }

  getAllUsers() {
    return this.users;
  }

  getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Patients
  getPatients(clinicId: string) {
    return this.patients.filter(p => p.clinicId === clinicId);
  }

  addPatient(clinicId: string, name: string, phone: string, notes?: string) {
    const existing = this.patients.find(p => p.clinicId === clinicId && p.phone === phone);
    if (existing) return existing;

    const newPatient: PatientData = {
      id: `pat-${Date.now()}`,
      clinicId,
      name,
      phone,
      whatsappId: phone.replace(/[^0-9]/g, ''),
      communicationPref: 'WHATSAPP',
      notes,
      createdAt: new Date().toISOString(),
    };
    this.patients.unshift(newPatient);
    return newPatient;
  }

  // Appointment Types
  getAppointmentTypes(clinicId: string) {
    return this.appointmentTypes.filter(at => at.clinicId === clinicId);
  }

  // Appointments
  getAppointments(clinicId: string) {
    return this.appointments.filter(a => a.clinicId === clinicId);
  }

  addAppointment(data: Omit<AppointmentData, 'id'>) {
    const newApt: AppointmentData = {
      ...data,
      id: `app-${Date.now()}`,
    };
    this.appointments.unshift(newApt);
    this.logAudit(data.clinicId, 'موظف الاستقبال / النظام', 'RECEPTIONIST', 'CREATE_APPOINTMENT', `حجز موعد جديد للمريض ${data.patientName}`);
    
    // Auto schedule reminder
    this.scheduleReminder(data.clinicId, newApt.id, data.patientName, newApt.startDateTime);
    return newApt;
  }

  updateAppointmentStatus(id: string, status: AppointmentData['status']) {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      this.logAudit(apt.clinicId, 'طاقم العيادة', 'RECEPTIONIST', 'UPDATE_APPOINTMENT_STATUS', `تغيير حالة موعد ${apt.patientName} إلى ${status}`);
    }
    return apt;
  }

  // Queue Management
  getQueue(clinicId: string) {
    return this.queue.filter(q => q.clinicId === clinicId);
  }

  markPatientArrived(clinicId: string, patientId: string, patientName: string, patientPhone: string, appointmentId?: string) {
    const currentQueue = this.getQueue(clinicId);
    const maxNum = currentQueue.reduce((max, item) => Math.max(max, item.queueNumber), 100);
    const newNumber = maxNum + 1;

    const newEntry: QueueEntryData = {
      id: `q-${Date.now()}`,
      clinicId,
      patientId,
      patientName,
      patientPhone,
      appointmentId,
      queueNumber: newNumber,
      status: 'WAITING',
      estimatedWaitMinutes: currentQueue.filter(q => q.status === 'WAITING').length * 20,
      checkInTime: new Date().toISOString(),
      notifiedApproaching: false,
    };

    this.queue.push(newEntry);

    // Update appointment status if exists
    if (appointmentId) {
      this.updateAppointmentStatus(appointmentId, 'PATIENT_ARRIVED');
    }

    this.logAudit(clinicId, 'موظف الاستقبال', 'RECEPTIONIST', 'PATIENT_ARRIVED', `تسجيل وصول المريض ${patientName} وإسناد رقم الطابور ${newNumber}`);
    return newEntry;
  }

  callNextPatient(clinicId: string) {
    const currentQueue = this.getQueue(clinicId);
    
    // Complete current in-consultation patient
    const currentInConsult = currentQueue.find(q => q.status === 'IN_CONSULTATION');
    if (currentInConsult) {
      currentInConsult.status = 'COMPLETED';
      if (currentInConsult.appointmentId) {
        this.updateAppointmentStatus(currentInConsult.appointmentId, 'COMPLETED');
      }
    }

    // Pick next waiting patient
    const nextWaiting = currentQueue.find(q => q.status === 'WAITING');
    if (nextWaiting) {
      nextWaiting.status = 'IN_CONSULTATION';
      if (nextWaiting.appointmentId) {
        this.updateAppointmentStatus(nextWaiting.appointmentId, 'IN_CONSULTATION');
      }
      this.logAudit(clinicId, 'الطبيب / الاستقبال', 'DOCTOR', 'CALL_NEXT_PATIENT', `استدعاء المريض ${nextWaiting.patientName} (رقم ${nextWaiting.queueNumber}) للدخول للكشف`);

      // Notify the second-in-line patient that their turn is approaching
      const upcomingWaiting = currentQueue.filter(q => q.status === 'WAITING' && q.id !== nextWaiting.id);
      if (upcomingWaiting.length > 0) {
        const approachingPatient = upcomingWaiting[0];
        approachingPatient.notifiedApproaching = true;
        this.addBotMessage(clinicId, approachingPatient.patientId, `دورك اقترب (رقم ${approachingPatient.queueNumber})، من فضلك توجّه إلى العيادة الآن.`);
      }

      return nextWaiting;
    }

    return null;
  }

  reorderQueue(clinicId: string, queueId: string, direction: 'UP' | 'DOWN') {
    const qList = this.getQueue(clinicId).filter(q => q.status === 'WAITING');
    const idx = qList.findIndex(q => q.id === queueId);
    if (idx === -1) return;

    if (direction === 'UP' && idx > 0) {
      const temp = qList[idx].queueNumber;
      qList[idx].queueNumber = qList[idx - 1].queueNumber;
      qList[idx - 1].queueNumber = temp;
    } else if (direction === 'DOWN' && idx < qList.length - 1) {
      const temp = qList[idx].queueNumber;
      qList[idx].queueNumber = qList[idx + 1].queueNumber;
      qList[idx + 1].queueNumber = temp;
    }
  }

  // Conversations & Live Messages
  getConversations(clinicId: string) {
    return this.conversations.filter(c => c.clinicId === clinicId);
  }

  getMessages(conversationId: string) {
    return this.messages.filter(m => m.conversationId === conversationId);
  }

  toggleHumanTakeover(conversationId: string, isTakeover: boolean) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.isHumanTakeover = isTakeover;
      this.logAudit(conv.clinicId, 'موظف الاستقبال', 'RECEPTIONIST', 'TOGGLE_HUMAN_TAKEOVER', `${isTakeover ? 'تفعيل' : 'إلغاء'} التدخل البشري لمحادثة المريض ${conv.patientName}`);
    }
    return conv;
  }

  addPatientMessage(clinicId: string, patientPhone: string, patientName: string, text: string) {
    let patient = this.patients.find(p => p.clinicId === clinicId && p.phone === patientPhone);
    if (!patient) {
      patient = this.addPatient(clinicId, patientName, patientPhone);
    }

    let conv = this.conversations.find(c => c.clinicId === clinicId && c.patientId === patient!.id);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        clinicId,
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        isHumanTakeover: false,
        lastMessageText: text,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
      };
      this.conversations.unshift(conv);
    } else {
      conv.lastMessageText = text;
      conv.lastMessageTime = new Date().toISOString();
      conv.unreadCount += 1;
    }

    const newMsg: MessageData = {
      id: `msg-${Date.now()}`,
      clinicId,
      conversationId: conv.id,
      senderType: 'PATIENT',
      senderName: patient.name,
      content: text,
      deliveryStatus: 'READ',
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMsg);
    return { patient, conv, message: newMsg };
  }

  addBotMessage(clinicId: string, patientId: string, text: string, isSafeguard: boolean = false) {
    const conv = this.conversations.find(c => c.clinicId === clinicId && c.patientId === patientId);
    if (!conv) return null;

    conv.lastMessageText = text;
    conv.lastMessageTime = new Date().toISOString();
    if (isSafeguard) {
      conv.isHumanTakeover = true;
    }

    const newMsg: MessageData = {
      id: `msg-${Date.now()}`,
      clinicId,
      conversationId: conv.id,
      senderType: 'BOT',
      senderName: 'مستقبل العيادة الذكي',
      content: text,
      deliveryStatus: 'DELIVERED',
      isMedicalSafeguardRefusal: isSafeguard,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMsg);
    return newMsg;
  }

  addStaffMessage(conversationId: string, staffName: string, text: string) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return null;

    conv.lastMessageText = text;
    conv.lastMessageTime = new Date().toISOString();

    const newMsg: MessageData = {
      id: `msg-${Date.now()}`,
      clinicId: conv.clinicId,
      conversationId: conv.id,
      senderType: 'STAFF',
      senderName: staffName,
      content: text,
      deliveryStatus: 'SENT',
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMsg);
    return newMsg;
  }

  // Templates
  getTemplates(clinicId: string) {
    return this.templates.filter(t => t.clinicId === clinicId);
  }

  addTemplate(data: Omit<MessageTemplateData, 'id'>) {
    const newTmpl: MessageTemplateData = {
      ...data,
      id: `tmpl-${Date.now()}`,
    };
    this.templates.push(newTmpl);
    return newTmpl;
  }

  // Reminders
  getReminders(clinicId: string) {
    return this.reminderJobs.filter(r => r.clinicId === clinicId);
  }

  scheduleReminder(clinicId: string, appointmentId: string, patientName: string, startDateTime: string) {
    const aptTime = new Date(startDateTime).getTime();
    const remTime = new Date(aptTime - 2 * 60 * 60 * 1000).toISOString();

    const job: ReminderJobData = {
      id: `rem-${Date.now()}`,
      clinicId,
      appointmentId,
      patientName,
      reminderType: 'HOURS_2',
      scheduledTime: remTime,
      status: 'SCHEDULED',
    };
    this.reminderJobs.push(job);
    return job;
  }

  // Audit Logs
  getAuditLogs(clinicId?: string) {
    if (clinicId) {
      return this.auditLogs.filter(l => l.clinicId === clinicId || !l.clinicId);
    }
    return this.auditLogs;
  }

  logAudit(clinicId: string | undefined, userName: string, userRole: string, action: string, details: string) {
    const log: AuditLogData = {
      id: `log-${Date.now()}`,
      clinicId,
      userName,
      userRole,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

export const clinicStore = new ClinicStore();
