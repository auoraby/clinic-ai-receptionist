# مستقبل العيادة الذكي | Multi-Tenant SaaS Clinic AI Receptionist

تطبيق مسبار وعالي الأداء ومصمم خصيصاً للعمل على الهواتف والويب أولاً (Mobile-First Arabic RTL Web Application & PWA) لإدارة استقبال العيادات وحجز المواعيد آلياً عبر الذكاء الاصطناعي ودمج **Meta WhatsApp Cloud API** و **Google Calendar**.

> **ملاحظة هامة (Draft MVP Labeling)**: جميع الإجابات والرسائل المؤتمتة وبيانات العيادة المبدئية هي مسودات قابلة للتعديل والتحكم الكامل من لوحة تحكم العيادة والمدير العام.

---

## 🌟 أبرز المميزات والإمكانيات الرئيسية

### 1. منصة متعددة العيادات والأطباء (Multi-Tenant SaaS Architecture)
- **بوابة المدير العام (Super Admin Portal)**: إضافة أي عيادة أو طبيب جديد في ثوانٍ وتخصيص بياناتهم (اسم الدكتور، التخصص، ساعات العمل، رقم واتساب، رابط خرائط Google Maps).
- **عزل تبيان البيانات (Tenant Isolation)**: عزل كلي للمرضى، المواعيد، طابور الانتظار، وقوالب الواتساب لكل عيادة على حدة.
- **توجيه الويب هوك الـ التلقائي (Dynamic Webhook Router)**: يتعرف الـ Webhook تلقائياً على العيادة المستهدفة بناءً على رقم الواتساب الموجه إليه.

### 2. موظف الاستقبال الذكي عبر الواتساب (WhatsApp AI Receptionist)
- **التعرف الآلي على النوايا (Intent Recognition Engine)**:
  - حجز موعد جديد وتحديد الخدمة والتوقيت.
  - الاستفسار عن ساعات وأيام العمل وعنوان العيادة.
  - تأجيل وإلغاء المواعيد.
  - طلب التحدث مع موظف استقبال بشري.
- **فلتر الحماية والسلامة الطبية الفوري (Medical Triage Safeguard)**:
  - النظام مصمم للرد الإداري فقط.
  - يُمنع المساعد الآلي منعاً باتاً من تقديم تشخيص طبي، التوصية بأدوية أو مراهم، أو قطع وعود بعلاج.
  - عند استلام أعراض أو صور أو حالات طوارئ، يرفض المساعد الإجابة آلياً ويقوم بتحويل المحادثة فوراً لطاقم العيادة.
- **التدخل البشري اليدوي (Human Takeover)**: تمكين موظف الاستقبال من استلام المحادثة في أي وقت وإيقاف الرد الآلي.
- **منع التكرار (Idempotency)**: منع الردود المزدوجة عند تكرار إرسال الـ Webhooks من سيرفرات Meta.

### 3. إدارة المواعيد والتقويم (Appointment & Google Calendar Sync)
- منع الحجز المزدوج والتعارضات (Double booking prevention).
- مزامنة مباشرة ومزدوجة مع Google Calendar.
- تتبع حالات الموعد: (بانتظار التفاصيل ، مؤكد ، وصل العيادة ، داخل الكشف ، مكتمل ، ملغى).

### 4. طابور الانتظار والشاشة العامة (Queue & Public TV Display)
- تسجيل وصول المريض وإعادة احتساب زمن الانتظار التقديري.
- إرسال تنبيه واتساب آلي: `"دورك اقترب (رقم Q-102)، من فضلك توجّه إلى العيادة."`
- **حماية خصوصية المرضى**: إخفاء أسماء وأرقام المرضى على شاشة التلفزيون العامة (`Q-101 (ن*** ص***)`).

### 5. التذكيرات الآلية والقوالب (Automated Reminders & WhatsApp Templates)
- تذكيرات مجدولة قبل الموعد بـ 24 ساعة و 2 ساعة.
- قوالب معتمدة من Meta مع دعم متغيرات الحجز (`{{1}}`, `{{2}}`).

---

## 🛠 التقنيات المستخدمة (Tech Stack)

- **الفريمورك الأساسي**: Next.js 14 (App Router, React 18, TypeScript)
- **التصميم والواجهة**: Tailwind CSS, Lucide Icons (Arabic Tajawal Typography, RTL Layout)
- **قواعد البيانات**: Prisma ORM مع SQLite (سهولة التشغيل المحلي والدعم الكامل لـ PostgreSQL/Supabase)
- **الأمان والتحقق**: Meta HMAC-SHA256 Webhook Verification, Token Challenge Validator, RBAC Auth.

---

## 🚀 كيفية التشغيل والربط (Setup & Quickstart Guide)

### 1. تثبيت الحزم وتشغيل التطبيق محلياً
```bash
# تثبيت التبعيات
npm install

# توليد قاعدة البيانات
npx prisma generate
npx prisma db push

# تشغيل خادم التطوير
npm run dev
```
افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

### 2. تشغيل الاختبارات الآلية (Automated Test Suite)
```bash
node --test tests/webhook-and-logic.test.mjs
```

### 3. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env` واضطبط القيم كالتالي:
```env
DATABASE_URL="file:./dev.db"
META_WEBHOOK_VERIFY_TOKEN="clinic_ai_secret_verify_token_2026"
META_APP_SECRET="mock_meta_app_secret_998877"
GOOGLE_CALENDAR_CLIENT_ID="your_google_client_id"
GOOGLE_CALENDAR_CLIENT_SECRET="your_google_client_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. اختبار الـ Webhook مع Meta عبر ngrok
1. قم بتشغيل ngrok لإتاحة المنفذ المحلي:
   ```bash
   ngrok http 3000
   ```
2. انسخ الرابط المولد وضع مسار الـ Webhook:
   `https://xxxx.ngrok-free.app/api/webhooks/whatsapp`
3. أدخل هذا الرابط في صفحة **Meta WhatsApp Developer Console** مع الـ Verify Token:
   `clinic_ai_secret_verify_token_2026`

---

## 🔑 أدوار المستخدمين الجاهزة للتجربة المباشرة (Preset Roles)

| الدور | البريد الإلكتروني | كلمة المرور | الصلاحية |
| :--- | :--- | :--- | :--- |
| **مدير النظام (Super Admin)** | `admin@clinicai.com` | `admin123` | إضافة العيادات والمراكز وإدارتها بالكامل |
| **طبيب العيادة (Doctor)** | `dr.sara@clinicai.com` | `doctor123` | متابعة المواعيد والطابور واستدعاء المرضى |
| **موظف الاستقبال (Receptionist)** | `rec.mona@clinicai.com` | `staff123` | تسجيل الوصول، المحادثات المباشرة، والتصعيد |
