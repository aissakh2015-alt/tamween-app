import { useState } from 'react';
import { Icon } from '../ui/Icon';
import Modal from '../ui/Modal';

export default function HomePage({ requirements, orders, stock, onNavigate }) {
  const [activeAlert, setActiveAlert] = useState(null);

  // ═══ حساب الإحصائيات ═══
  const redReqs     = requirements.filter(r => r.status === 'red');
  const orangeReqs  = requirements.filter(r => r.status === 'orange');
  const blueOrders  = orders.filter(o => o.status === 'blue');
  const greenOrders = orders.filter(o => o.status === 'green');
  const lowStock    = stock.filter(s => s.current <= s.min);

  /* ═══════════════════════════════════════════════════════
   *  البطاقات الأربعة (نفس ما في الرسم البياني)
   * ═══════════════════════════════════════════════════════ */
  const cards = [
    {
      key: 'red-reqs',
      label: 'احتياجات لم يتم',
      sublabel: 'بحاجة لمعالجة',
      value: redReqs.length,
      gradient: 'from-red-400 to-red-600',
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: 'Alert',
    },
    {
      key: 'orange-reqs',
      label: 'احتياجات تمت التلبية',
      sublabel: 'قيد الانتظار في الطلبيات',
      value: orangeReqs.length,
      gradient: 'from-amber-400 to-amber-500',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: 'Clock',
    },
    {
      key: 'blue-orders',
      label: 'طلبيات في الطريق',
      sublabel: 'قادمة من الموردين',
      value: blueOrders.length,
      gradient: 'from-blue-400 to-blue-600',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: 'Truck',
    },
    {
      key: 'green-orders',
      label: 'طلبيات تم إنجازها',
      sublabel: 'مكتملة',
      value: greenOrders.length,
      gradient: 'from-emerald-400 to-emerald-600',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: 'Check',
    },
  ];

  const maxValue = Math.max(...cards.map(c => c.value), 1);

  /* ═══════════════════════════════════════════════════════
   *  التنبيهات (مع محتواها التفصيلي)
   * ═══════════════════════════════════════════════════════ */
  const alerts = [];

  if (lowStock.length > 0) {
    alerts.push({
      id: 'low-stock',
      level: 'warning',
      icon: 'Alert',
      title: `${lowStock.length} مواد وصلت للحد الأدنى`,
      desc: 'انقر لعرض التفاصيل',
      items: lowStock.map(s => ({
        name: s.name,
        type: s.type,
        current: s.current,
        min: s.min,
        shortage: Math.max(0, s.min - s.current),
        lastUpdate: s.lastUpdate,
      })),
      columns: ['المادة', 'النوع', 'الرصيد', 'الحد الأدنى', 'النقص', 'آخر تحديث'],
      ctaLabel: 'الانتقال إلى المخزون',
      ctaAction: () => onNavigate('stock'),
    });
  }

  if (redReqs.length > 0) {
    alerts.push({
      id: 'red-reqs',
      level: 'danger',
      icon: 'X',
      title: `${redReqs.length} احتياجات لم يتم معالجتها`,
      desc: 'انقر لعرض التفاصيل',
      items: redReqs.map(r => ({
        name: r.name,
        type: r.type,
        qty: r.qty,
        dateCreated: r.dateCreated,
        id: r.id,
      })),
      columns: ['الرقم', 'التاريخ', 'المادة', 'النوع', 'الكمية'],
      ctaLabel: 'الانتقال إلى الاحتياجات',
      ctaAction: () => onNavigate('requirements'),
    });
  }

  if (blueOrders.length > 0) {
    alerts.push({
      id: 'blue-orders',
      level: 'info',
      icon: 'Truck',
      title: `${blueOrders.length} طلبيات في الطريق`,
      desc: 'انقر لعرض التفاصيل',
      items: blueOrders.map(o => ({
        id: o.id,
        supplier: o.supplier,
        name: o.name,
        qty: o.qty,
        dateSent: o.dateSent,
      })),
      columns: ['رقم الطلبية', 'المورد', 'المادة', 'الكمية', 'تاريخ الإرسال'],
      ctaLabel: 'الانتقال إلى الطلبيات',
      ctaAction: () => onNavigate('orders'),
    });
  }

  /* ═══════════════════════════════════════════════════════
   *  رسم تفاصيل التنبيه (يُستخدم داخل Modal)
   * ═══════════════════════════════════════════════════════ */
  const renderAlertDetails = (alert) => {
    if (!alert) return null;

    // نحتاج مفاتيح الأعمدة بشكل صريح
    const keyMap = {
      'المادة': 'name',
      'النوع': 'type',
      'الرصيد': 'current',
      'الحد الأدنى': 'min',
      'النقص': 'shortage',
      'آخر تحديث': 'lastUpdate',
      'الرقم': 'id',
      'التاريخ': 'dateCreated',
      'الكمية': 'qty',
      'رقم الطلبية': 'id',
      'المورد': 'supplier',
      'تاريخ الإرسال': 'dateSent',
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          {alert.desc}
        </p>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {alert.columns.map((col) => (
                  <th key={col} className="text-right font-bold text-slate-600 px-3 py-2.5 text-xs whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alert.items.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  {alert.columns.map((col) => {
                    const key = keyMap[col];
                    let value = item[key];
                    if (value === null || value === undefined || value === '') value = '—';

                    // تلوين خاص لعمود "النقص"
                    if (col === 'النقص' && value > 0) {
                      return (
                        <td key={col} className="px-3 py-2.5 font-bold text-red-600 whitespace-nowrap">
                          {value}
                        </td>
                      );
                    }
                    return (
                      <td key={col} className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const alertStyles = {
    danger:  { border: 'border-r-red-500',     bg: 'bg-red-50',     text: 'text-red-600',   IconComp: Icon.X },
    warning: { border: 'border-r-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-600', IconComp: Icon.Alert },
    info:    { border: 'border-r-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-600',  IconComp: Icon.Truck },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

      {/* ═══════════════════════════════════════════════
       *  الرسم البياني (يترجم البطاقات)
       * ═══════════════════════════════════════════════ */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2.5">
          <Icon.Chart width="22" height="22" className="text-slate-700" />
          نظرة عامة
        </h3>

        <div
          className="flex items-end justify-around gap-3 pt-4 border-b-2 border-slate-200"
          style={{ minHeight: '280px' }}
        >
          {cards.map((card) => {
            const IconComp = Icon[card.icon];
            const height = card.value === 0 ? 15 : Math.max(40, (card.value / maxValue) * 200);

            return (
              <div
                key={card.key}
                className="flex-1 max-w-[120px] flex flex-col items-center
                           hover:-translate-y-1.5 transition-transform"
              >
                {/* القيمة */}
                <div className={`text-3xl font-extrabold mb-2 ${card.color}`}>
                  {card.value}
                </div>

                {/* العمود */}
                <div
                  className={`w-full bg-gradient-to-b ${card.gradient} rounded-t-xl
                              shadow-md hover:brightness-110 hover:shadow-lg transition-all
                              relative`}
                  style={{ height: `${height}px`, minHeight: '20px' }}
                >
                  {/* أيقونة داخل العمود */}
                  <div className="absolute inset-x-0 top-2 flex justify-center text-white/80">
                    <IconComp width="18" height="18" />
                  </div>
                </div>

                {/* التسمية */}
                <div className="mt-3 text-sm font-bold text-slate-800 text-center leading-tight">
                  {card.label}
                </div>
                <div className="text-[11px] text-slate-500 text-center mt-0.5">
                  {card.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
       *  التنبيهات (تفتح Modal عند النقر)
       * ═══════════════════════════════════════════════ */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2.5">
          <Icon.Bell width="22" height="22" className="text-slate-700" />
          التنبيهات
        </h3>

        <div className="flex-1 space-y-2.5">
          {alerts.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              ✨ لا توجد تنبيهات حالياً
            </div>
          ) : (
            alerts.map((alert) => {
              const style = alertStyles[alert.level];
              const AlertIcon = style.IconComp;

              return (
                <div
                  key={alert.id}
                  onClick={() => setActiveAlert(alert)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl
                             border-r-4 cursor-pointer transition-all
                             hover:-translate-x-1 hover:shadow-md
                             ${style.bg} ${style.border}`}
                >
                  <div className={`w-10 h-10 rounded-full bg-white grid place-items-center shrink-0 ${style.text}`}>
                    <AlertIcon width="20" height="20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-sm">{alert.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{alert.desc}</div>
                  </div>
                  <div className="text-slate-400">
                    <Icon.Eye width="16" height="16" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
       *  Modal التفاصيل
       * ═══════════════════════════════════════════════ */}
      <Modal
        open={!!activeAlert}
        onClose={() => setActiveAlert(null)}
        title={activeAlert?.title || ''}
        icon={activeAlert?.icon || 'Bell'}
        footer={
          <>
            <button
              onClick={() => setActiveAlert(null)}
              className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200
                         text-slate-700 font-bold text-sm transition"
            >
              إغلاق
            </button>
            <button
              onClick={() => {
                const action = activeAlert?.ctaAction;
                setActiveAlert(null);
                if (action) action();
              }}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900
                         text-white font-bold text-sm transition inline-flex items-center gap-2"
            >
              <Icon.ArrowLeft width="16" height="16" />
              {activeAlert?.ctaLabel}
            </button>
          </>
        }
      >
        {renderAlertDetails(activeAlert)}
      </Modal>
    </div>
  );
}