import { useRef } from 'react';
import { Icon } from '../ui/Icon';
import {
  exportToExcel,
  exportAllToExcel,
  importFromExcel,
  exportBackupJSON,
  importBackupJSON,
} from '../../utils/excelUtils';

/* ═══════════════════════════════════════════════════
 *  بطاقة تصدير
 * ═══════════════════════════════════════════════════ */
function ExportCard({ icon: IconComp, title, desc, count, onExport, color }) {
  const colorClasses = {
    blue:    'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber:   'bg-amber-50 text-amber-600 border-amber-200',
    purple:  'bg-purple-50 text-purple-600 border-purple-200',
    slate:   'bg-slate-100 text-slate-700 border-slate-200',
  };
  const cls = colorClasses[color] || colorClasses.slate;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm
                    hover:shadow-md transition-all flex flex-col">
      <div className={`w-12 h-12 rounded-xl grid place-items-center border ${cls} mb-3`}>
        <IconComp width="22" height="22" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {count} {count === 1 ? 'سجل' : 'سجلات'}
        </span>
        <button
          onClick={onExport}
          disabled={count === 0}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900
                     disabled:bg-slate-200 disabled:cursor-not-allowed
                     text-white font-bold text-xs transition
                     inline-flex items-center gap-1.5"
        >
          <Icon.Package width="14" height="14" />
          تصدير Excel
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 *  الصفحة الرئيسية
 * ═══════════════════════════════════════════════════ */
export default function ReportsPage({ stock, requirements, orders, received, onImportData }) {
  const excelInputRef = useRef(null);
  const jsonInputRef  = useRef(null);

  /* ─── أعمدة التصدير لكل جدول ─── */
  const stockColumns = [
    { key: 'name',       label: 'المادة' },
    { key: 'type',       label: 'النوع' },
    { key: 'current',    label: 'الكمية الحالية' },
    { key: 'min',        label: 'الحد الأدنى' },
    { key: 'shortage',   label: 'النقص', transform: (r) => Math.max(0, r.min - r.current) },
    { key: 'status',     label: 'الحالة', transform: (r) => r.current <= r.min ? 'تحت الحد الأدنى' : 'كافٍ' },
    { key: 'lastUpdate', label: 'آخر تحديث' },
  ];

  const reqColumns = [
    { key: 'id',           label: 'الرقم' },
    { key: 'dateCreated',  label: 'التاريخ' },
    { key: 'name',         label: 'المادة' },
    { key: 'type',         label: 'النوع' },
    { key: 'qty',          label: 'الكمية' },
    { key: 'statusLabel',  label: 'الحالة', transform: (r) => r.status === 'red' ? 'لم يتم' : 'تمت التلبية' },
  ];

  const orderColumns = [
    { key: 'id',           label: 'رقم الطلبية' },
    { key: 'dateCreated',  label: 'تاريخ الطلب' },
    { key: 'dateSent',     label: 'تاريخ الإرسال' },
    { key: 'dateReceived', label: 'تاريخ الاستلام' },
    { key: 'supplier',     label: 'المورد' },
    { key: 'name',         label: 'المادة' },
    { key: 'type',         label: 'النوع' },
    { key: 'qty',          label: 'الكمية' },
    { key: 'statusLabel',  label: 'الحالة', transform: (o) =>
        o.status === 'orange' ? 'قيد الانتظار'
      : o.status === 'blue'   ? 'في الطريق'
      : 'تم إنجازه' },
  ];

  const receivedColumns = [
    { key: 'orderId',      label: 'رقم الطلبية' },
    { key: 'name',         label: 'المادة' },
    { key: 'type',         label: 'النوع' },
    { key: 'qty',          label: 'الكمية' },
    { key: 'supplier',     label: 'المورد' },
    { key: 'dateCreated',  label: 'تاريخ الطلب' },
    { key: 'dateSent',     label: 'تاريخ الإرسال' },
    { key: 'dateReceived', label: 'تاريخ الاستلام' },
    { key: 'days',         label: 'المدة (أيام)', transform: (r) => {
        if (!r.dateSent || !r.dateReceived) return '—';
        const a = new Date(r.dateSent.replace(' ', 'T'));
        const b = new Date(r.dateReceived.replace(' ', 'T'));
        return Math.ceil(Math.abs(b - a) / (1000 * 60 * 60 * 24));
      } },
  ];

  /* ═══════════════════════════════════════════════
   *  معالجات الأزرار
   * ═══════════════════════════════════════════════ */
  const handleExportAll = () => {
    exportAllToExcel({ stock, requirements, orders, received });
  };

  const handleExportBackup = () => {
    exportBackupJSON({ stock, requirements, orders, received });
  };

  const handleImportExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importFromExcel(
      file,
      (rows) => {
        alert(`✅ تم قراءة ${rows.length} صف من الملف.\n\n` +
              `ملاحظة: الاستيراد التلقائي قيد التطوير.\n` +
              `سيتم لاحقاً ربطه بالمخزون.`);
        console.log('📥 بيانات مستوردة:', rows);
        e.target.value = ''; // reset
      },
      (err) => {
        alert('❌ فشل قراءة الملف. تأكد من أنه ملف Excel صحيح.');
        console.error(err);
        e.target.value = '';
      }
    );
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importBackupJSON(
      file,
      (data) => {
        const ok = window.confirm(
          '⚠️ سيتم استبدال كل البيانات الحالية بالنسخة الاحتياطية.\n\n' +
          'هل أنت متأكد؟'
        );
        if (ok) {
          onImportData?.(data);
          alert('✅ تم استيراد النسخة الاحتياطية بنجاح');
        }
        e.target.value = '';
      },
      (err) => {
        alert('❌ فشل قراءة الملف. تأكد من أنه ملف JSON صحيح.');
        console.error(err);
        e.target.value = '';
      }
    );
  };

  return (
    <div className="space-y-5">

      {/* ═══ زر التصدير الشامل ═══ */}
      <div className="bg-gradient-to-l from-slate-800 to-slate-700 text-white
                      rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-white/10 grid place-items-center shrink-0">
            <Icon.Package width="26" height="26" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-extrabold">تقرير شامل (كل الأقسام)</h3>
            <p className="text-white/70 text-sm mt-1">
              ملف Excel واحد يحتوي على 4 أوراق: المخزون، الاحتياجات، الطلبيات، المقتنيات
            </p>
          </div>
          <button
            onClick={handleExportAll}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600
                       font-bold transition inline-flex items-center gap-2 shadow-lg"
          >
            <Icon.Package width="18" height="18" />
            تصدير التقرير الكامل
          </button>
        </div>
      </div>

      {/* ═══ بطاقات التصدير الفردية ═══ */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Icon.Chart width="20" height="20" />
          تصدير أقسام منفصلة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExportCard
            icon={Icon.Warehouse}
            title="المخزون"
            desc="كل الأصناف مع الرصيد الحالي"
            count={stock.length}
            color="blue"
            onExport={() => exportToExcel(stock, stockColumns, 'المخزون', 'المخزون')}
          />
          <ExportCard
            icon={Icon.Clipboard}
            title="الاحتياجات"
            desc="كل الاحتياجات وحالتها"
            count={requirements.length}
            color="amber"
            onExport={() => exportToExcel(requirements, reqColumns, 'الاحتياجات', 'الاحتياجات')}
          />
          <ExportCard
            icon={Icon.Cart}
            title="الطلبيات"
            desc="جدول الطلبيات الكامل"
            count={orders.length}
            color="emerald"
            onExport={() => exportToExcel(orders, orderColumns, 'الطلبيات', 'الطلبيات')}
          />
          <ExportCard
            icon={Icon.Package}
            title="المقتنيات"
            desc="السجل التاريخي للمقتنيات"
            count={received.length}
            color="purple"
            onExport={() => exportToExcel(received, receivedColumns, 'المقتنيات', 'المقتنيات')}
          />
        </div>
      </div>

      {/* ═══ النسخ الاحتياطي والاستيراد ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* النسخ الاحتياطي */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200
                            grid place-items-center">
              <Icon.Check width="20" height="20" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">نسخة احتياطية كاملة</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ملف JSON يحتوي على كل بيانات التطبيق
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExportBackup}
              className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700
                         text-white font-bold text-sm transition
                         inline-flex items-center justify-center gap-2"
            >
              <Icon.Package width="16" height="16" />
              تنزيل نسخة احتياطية
            </button>

            <button
              onClick={() => jsonInputRef.current?.click()}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200
                         text-slate-700 font-bold text-sm transition
                         inline-flex items-center justify-center gap-2"
            >
              <Icon.Refresh width="16" height="16" />
              استيراد نسخة احتياطية
            </button>
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            💡 احفظ النسخة على جهاز آخر أو في السحابة
          </p>
        </div>

        {/* استيراد Excel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200
                            grid place-items-center">
              <Icon.ArrowLeft width="20" height="20" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">استيراد من Excel</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                قراءة أصناف من ملف Excel موجود
              </p>
            </div>
          </div>

          <button
            onClick={() => excelInputRef.current?.click()}
            className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700
                       text-white font-bold text-sm transition
                       inline-flex items-center justify-center gap-2"
          >
            <Icon.Package width="16" height="16" />
            اختر ملف Excel
          </button>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />

          <p className="text-xs text-slate-400 mt-3 text-center">
            💡 الاستيراد التلقائي الكامل قيد التطوير
          </p>
        </div>
      </div>

      {/* ═══ معلومات ═══ */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 grid place-items-center shrink-0">
            <Icon.Alert width="18" height="18" />
          </div>
          <div className="text-sm text-blue-800">
            <div className="font-bold mb-1">ملاحظات مهمة:</div>
            <ul className="space-y-1 text-blue-700">
              <li>• ملفات Excel تُفتح بـ Microsoft Excel أو Google Sheets أو LibreOffice.</li>
              <li>• النسخة الاحتياطية JSON تتيح استرجاع كامل للتطبيق على أي متصفح.</li>
              <li>• استيراد Excel يقرأ الصفوف لكن ربطها بالمخزون سيُضاف لاحقاً.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}