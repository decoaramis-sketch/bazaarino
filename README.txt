Bazaarino / کالاپیدا
====================

Bazaarino یک نمونه اپلیکیشن static/PWA با HTML، CSS و JavaScript vanilla برای نمایش، جستجو، فیلتر و ثبت نمایشی کالا است. پروژه برای انتشار روی static hosting مانند GitHub Pages طراحی شده و backend یا secret داخلی ندارد.

ساختار اصلی
-----------
- index.html: entry point و markup اصلی برنامه
- style.css: استایل responsive، focus state و PWA/mobile layout
- app.js: داده نمایشی محصولات، rendering امن، event delegation، فرم فروش، toast و localStorage cart count
- sw.js: Service Worker برای precache assetهای static و fallback آفلاین navigation
- manifest.json و icon.svg: metadata و icon برنامه PWA
- scripts/: validationهای dependency-free برای lint، format، HTML و assetها
- tests/: تست‌های Node test runner برای security و release checks

اجرای local
-----------
برای مشاهده محلی، از یک static server ساده استفاده کنید تا Service Worker نیز در origin واقعی تست شود:

    python3 -m http.server 8080

سپس صفحه را در مرورگر باز کنید:

    http://localhost:8080/

نصب و راه‌اندازی
----------------
این repository برای validation فعلی به dependency خارجی نیاز ندارد. اجرای npm install ضروری نیست. اگر در آینده dependency اضافه شد، package-lock را نیز commit کنید.

Commands
--------
- npm run validate: اجرای کامل release validation
- npm test: اجرای تست‌های Node built-in test runner
- npm run lint: بررسی static security/lint rules
- npm run format:check: بررسی newline انتهای فایل‌ها
- npm run html:check: بررسی ساختار حداقلی HTML
- node scripts/validate-assets.js: بررسی وجود assetهای local ارجاع‌شده در HTML و manifest

PWA behavior
------------
Service Worker فایل‌های static اصلی را precache می‌کند، cacheهای قدیمی را در activate حذف می‌کند، کنترل clients را پس از activate می‌گیرد، فقط requestهای GET و same-origin را مدیریت می‌کند و برای navigation در حالت offline به index.html fallback می‌دهد.

Deployment expectations
-----------------------
- فایل‌ها را در root یک static host منتشر کنید.
- HTTPS برای نصب PWA و Service Worker در production لازم است؛ localhost برای توسعه مجاز است.
- اگر path پروژه زیرمسیر است، manifest start_url و asset referenceهای نسبی فعلی باید همچنان از همان محل سرو شوند.

Production checklist
--------------------
قبل از release این موارد را اجرا کنید:

    npm run validate
    git diff --check

همچنین در یک مرورگر واقعی smoke test کنید: load، search، category filter، favorite، add-to-cart، sell modal، Escape برای بستن modal، refresh، و حالت offline بعد از install شدن Service Worker.

Known limitations
-----------------
- محصول‌ها و سبد خرید نمایشی هستند و backend/checkout واقعی وجود ندارد.
- تست browser E2E در این repository dependency-free نگه داشته شده است؛ اگر registry و browser runtime در CI در دسترس بود، Playwright می‌تواند به‌عنوان لایه مکمل اضافه شود.
- فونت Vazirmatn از Google Fonts بارگذاری می‌شود؛ در حالت offline ممکن است فونت fallback سیستم استفاده شود.
