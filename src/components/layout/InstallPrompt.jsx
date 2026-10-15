import { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // هل التطبيق مثبّت بالفعل؟
    const standalone = window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    // هل الجهاز iOS؟
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // هل تم تأجيل طلب التثبيت؟
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // على iOS: أظهر البانر دائماً (لأن iOS لا يدعم beforeinstallprompt)
    if (ios) {
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) setShowBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // على iOS، نعرض تعليمات فقط
      return;
    }
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('نتيجة التثبيت:', outcome);

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (isIOS) {
      localStorage.setItem('ios-install-dismissed', 'true');
    }
  };

  if (isStandalone || !showBanner) return null;

  /* ═══════════════════════════════════════════════
   *  iOS: بانر تعليمي
   * ═══════════════════════════════════════════════ */
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50
                      bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-4
                      animate-[slideUp_.3s_ease-out]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600
                          grid place-items-center shrink-0">
            <Icon.Package width="20" height="20" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-800 text-sm">تثبيت التطبيق</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">
              اضغط زر <b>المشاركة</b> ⬆️ في Safari، ثم اختر
              <b> "إضافة إلى الشاشة الرئيسية"</b>.
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <Icon.X width="18" height="18" />
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
   *  Android / Chrome / Edge: بانر بزر التثبيت
   * ═══════════════════════════════════════════════ */
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50
                    bg-gradient-to-l from-slate-800 to-slate-700 text-white
                    rounded-2xl shadow-2xl p-4
                    animate-[slideUp_.3s_ease-out]">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/10 grid place-items-center shrink-0">
          <Icon.Package width="22" height="22" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">ثبّت التطبيق على جهازك</div>
          <div className="text-xs text-white/70 mt-0.5">
            وصول سريع من الشاشة الرئيسية
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600
                         text-white font-bold text-xs transition
                         inline-flex items-center gap-1.5"
            >
              <Icon.Check width="14" height="14" /> تثبيت
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20
                         text-white/80 font-bold text-xs transition"
            >
              لاحقاً
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/50 hover:text-white transition shrink-0"
        >
          <Icon.X width="16" height="16" />
        </button>
      </div>
    </div>
  );
}