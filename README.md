# موقع جمعية الأمل الخيرية

## هيكل المشروع

```
├── index.html          الرئيسية
├── about.html           عن الجمعية
├── projects.html         مشاريعنا (9 مشاريع)
├── team.html             الفريق والتنسيق
├── contact.html          تواصل معنا
├── login.html            تسجيل الدخول / إنشاء حساب
├── css/
│   ├── themes.css        متغيرات الألوان (4 ثيمات + وضع داكن)
│   └── style.css         التنسيق العام لكل الموقع
├── js/
│   ├── lang.js           تبديل اللغة (عربي/إنجليزي) و RTL/LTR
│   ├── theme.js          تبديل لون الموقع
│   └── main.js           القائمة، النماذج، العدادات، تسجيل الدخول
├── php/                   الخادم (PHP + PDO)
│   ├── config.php         بيانات الاتصال بقاعدة البيانات — عدّلها أولاً
│   ├── login_process.php
│   ├── register_process.php
│   ├── logout_process.php
│   ├── check_session.php
│   ├── contact_process.php
│   └── subscribe_process.php
└── sql/
    └── database.sql       جداول: users, messages, subscribers, projects
```

## طريقة التشغيل على خادم حقيقي (PHP + MySQL)

1. أنشئ قاعدة بيانات ثم استورد `sql/database.sql`:
   ```
   mysql -u root -p -e "CREATE DATABASE hope_charity CHARACTER SET utf8mb4"
   mysql -u root -p hope_charity < sql/database.sql
   ```
2. عدّل بيانات الاتصال في `php/config.php` (اسم القاعدة، المستخدم، كلمة المرور).
3. ارفع المجلد كاملاً على استضافة تدعم PHP، أو شغّله محلياً:
   ```
   php -S localhost:8000
   ```
4. افتح `http://localhost:8000` من المتصفح.

## المعاينة السريعة بدون خادم (Demo Mode)

يمكنك فتح `index.html` مباشرة من جهازك بالنقر المزدوج، وسيعمل الموقع بالكامل
(القائمة، تبديل اللغة والثيم، النماذج، تسجيل الدخول التجريبي بحساب
`admin` / `admin123`) لأن `js/main.js` يتحول تلقائياً لوضعية تجريبية تعمل
محلياً عبر المتصفح عند عدم وجود خادم PHP متصل.

## ملاحظات

- الصور في صفحة المشاريع مرتبطة تلقائياً بمحتوى كل مشروع (تعليم، صحة،
  إغاثة، مياه، تمكين) عبر خدمة صور خارجية. لاستخدام صور خاصة بالجمعية،
  استبدل روابط `<img src="...">` في `projects.html` بمسارات صورك، مثال:
  `images/proj-education.jpg`.
- التصميم متجاوب بالكامل (Responsive) ويعمل على الموبايل بقائمة جانبية
  منزلقة تُفتح من زر الهامبرغر أعلى يمين الشاشة.
