import { Icon } from '../ui/Icon';

export default function SettingsPage({ types, onReset }) {
  return (
    <div className="space-y-5">

      {/* ═══ عن التطبيق ═══ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2.5">
          <Icon.Settings width="22" height="22" />
          عن التطبيق
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-500">الاسم</div>
            <div className="font-bold text-slate-800 mt-1">تطبيق دورة التموين</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-500">الإصدار</div>
            <div className="font-bold text-slate-800 mt-1">1.0.0</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-500">التخزين</div>
            <div className="font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <Icon.Check width="14" height="14" /> محفوظ محلياً
            </div>
          </div>
        </div>
      </div>

      {/* ═══ أنواع المواد ═══ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2.5">
          <Icon.Package width="22" height="22" />
          أنواع المواد ({types.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {types.map((t, i) => (
            <span key={i}
                  className="bg-blue-50 text-blue-700 border border-blue-200
                             px-4 py-2 rounded-xl font-semibold text-sm">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ معلومات الحفظ ═══ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2.5">
          <Icon.Check width="22" height="22" className="text-emerald-600" />
          حفظ البيانات
        </h3>
        <ul className="space-y-2 text-sm text-slate-600 mb-5">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">✓</span>
            <span>كل تغيير <b>يُحفظ تلقائياً</b> في متصفحك.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">✓</span>
            <span>البيانات تبقى موجودة حتى بعد إغلاق المتصفح.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">⚠</span>
            <span>البيانات محفوظة في <b>هذا المتصفح فقط</b> — لا تُزامَن مع أجهزة أخرى.</span>
          </li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Icon.Alert width="18" height="18" />
            منطقة خطر
          </div>
          <p className="text-sm text-amber-700 mb-3">
            حذف كل البيانات وإعادة التطبيق للوضع الافتراضي.
          </p>
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700
                       text-white font-bold text-sm transition
                       inline-flex items-center gap-2"
          >
            <Icon.X width="16" height="16" /> حذف كل البيانات
          </button>
        </div>
      </div>
    </div>
  );
}