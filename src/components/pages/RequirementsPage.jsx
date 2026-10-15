import { useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';
import Modal from '../ui/Modal';

export default function RequirementsPage({
  requirements,
  onAdd,
  onEdit,
  onConvert,
  types,
}) {
  // ═══ حالة الفرز ═══
  const [sortKey, setSortKey] = useState('dateCreated');
  const [sortDir, setSortDir] = useState('desc');

  // ═══ حالة النوافذ ═══
  const [addOpen, setAddOpen]       = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [editing, setEditing]       = useState(null);

  // ═══ نموذج الإضافة ═══
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState(types[0]);
  const [formQty, setFormQty]   = useState('');

  // ═══ فرز البيانات ═══
  const sortedReqs = useMemo(() => {
    const copy = [...requirements];
    copy.sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (sortKey === 'qty') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const cmp = String(va).localeCompare(String(vb), 'ar');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [requirements, sortKey, sortDir]);

  const redReqs    = sortedReqs.filter(r => r.status === 'red');
  const orangeReqs = sortedReqs.filter(r => r.status === 'orange');

  // ═══ النقر على العنوان للفرز ═══
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-slate-300 ml-1">⇅</span>;
    return <span className="text-blue-600 ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  // ═══ فتح نافذة الإضافة ═══
  const openAdd = () => {
    setFormName('');
    setFormType(types[0]);
    setFormQty('');
    setAddOpen(true);
  };

  // ═══ تأكيد الإضافة ═══
  const confirmAdd = () => {
    const name = formName.trim();
    const qty = parseInt(formQty);
    if (!name || !qty || qty <= 0) {
      alert('⚠️ الرجاء إدخال اسم المادة والكمية بشكل صحيح');
      return;
    }
    onAdd({ name, type: formType, qty });
    setAddOpen(false);
  };

  // ═══ فتح نافذة التعديل ═══
  const openEdit = (req) => {
    setEditing(req);
    setFormName(req.name);
    setFormType(req.type);
    setFormQty(req.qty);
    setEditOpen(true);
  };

  // ═══ تأكيد التعديل ═══
  const confirmEdit = () => {
    const name = formName.trim();
    const qty = parseInt(formQty);
    if (!name || !qty || qty <= 0) {
      alert('⚠️ الرجاء إدخال اسم المادة والكمية بشكل صحيح');
      return;
    }
    onEdit(editing.id, { name, type: formType, qty });
    setEditOpen(false);
    setEditing(null);
  };

  // ═══ شارة الحالة ═══
  const StatusPill = ({ status }) => {
    if (status === 'red') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full
                         bg-red-50 text-red-700 border border-red-200 whitespace-nowrap">
          <Icon.X width="13" height="13" /> لم يتم
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full
                       bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
        <Icon.Clock width="13" height="13" /> تمت التلبية
      </span>
    );
  };

  // ═══ صف الجدول ═══
  const ReqRow = ({ r }) => (
    <tr className="hover:bg-slate-50/70 transition">
      <td className="px-4 py-3 font-mono text-xs text-slate-500">#{r.id}</td>
      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{r.dateCreated}</td>
      <td className="px-4 py-3 font-semibold text-slate-800">{r.name}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{r.type}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{r.qty}</td>
      <td className="px-4 py-3"><StatusPill status={r.status} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {r.status === 'red' && (
            <button
              onClick={() => onConvert(r.id)}
              title="تحويل إلى طلبية"
              className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-600 text-white
                         grid place-items-center transition shadow-sm"
            >
              <Icon.ArrowLeft width="16" height="16" />
            </button>
          )}
          <button
            onClick={() => openEdit(r)}
            title="تعديل"
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-blue-500 hover:text-white
                       text-slate-600 grid place-items-center transition"
          >
            <Icon.Edit width="16" height="16" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* ═══ الترويسة ═══ */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Icon.Clipboard width="22" height="22" />
            جدول متابعة الاحتياج
          </h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            انقر على عمود للفرز
          </span>
        </div>

        {/* ═══ الجدول ═══ */}
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
           <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th onClick={() => handleSort('id')}          className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">الرقم <SortIcon col="id" /></th>
                <th onClick={() => handleSort('dateCreated')} className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الاحتياج <SortIcon col="dateCreated" /></th>
                <th onClick={() => handleSort('name')}        className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">المادة <SortIcon col="name" /></th>
                <th onClick={() => handleSort('type')}        className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">النوع <SortIcon col="type" /></th>
                <th onClick={() => handleSort('qty')}         className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">الكمية <SortIcon col="qty" /></th>
                <th className="text-right font-bold px-4 py-3 whitespace-nowrap">الحالة</th>
                <th className="text-right font-bold px-4 py-3 whitespace-nowrap">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

              {/* ─── مجموعة: لم يتم ─── */}
              {redReqs.length > 0 && (
                <>
                  <tr>
                    <td colSpan="7" className="bg-slate-800 text-white text-center text-xs
                                                font-bold py-2.5 tracking-wide">
                      ⬆️ لم يتم &nbsp;|&nbsp; تمت التلبية (قيد الانتظار في الطلبيات) ⬇️
                    </td>
                  </tr>
                  {redReqs.map(r => <ReqRow key={r.id} r={r} />)}
                </>
              )}

              {/* ─── فاصل ─── */}
              {redReqs.length > 0 && orangeReqs.length > 0 && (
                <tr>
                  <td colSpan="7" className="bg-slate-100 text-center text-xs font-bold text-slate-500 py-2">
                    ⬇️ احتياجات تمت تلبيتها
                  </td>
                </tr>
              )}

              {/* ─── مجموعة: تمت التلبية ─── */}
              {orangeReqs.map(r => <ReqRow key={r.id} r={r} />)}
            </tbody>
          </table>

          {requirements.length === 0 && (
            <div className="text-center text-slate-400 py-16">
              ✨ لا توجد احتياجات بعد
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
       *  زر ➕ العائم
       * ═══════════════════════════════════════════════ */}
      <button
        onClick={openAdd}
        title="إضافة احتياج جديد"
        className="fixed bottom-6 left-4 sm:bottom-8 sm:left-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full
                   bg-gradient-to-br from-emerald-500 to-emerald-700
                   text-white shadow-2xl shadow-emerald-500/40
                   grid place-items-center hover:scale-110 hover:rotate-90
                   transition-transform duration-300 z-40"
      >
        <Icon.Plus width="28" height="28" />
      </button>

      {/* ═══════════════════════════════════════════════
       *  Modal الإضافة
       * ═══════════════════════════════════════════════ */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="إضافة احتياج جديد"
        icon="Plus"
        footer={
          <>
            <button onClick={() => setAddOpen(false)}
                    className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200
                               text-slate-700 font-bold text-sm transition">
              إلغاء
            </button>
            <button onClick={confirmAdd}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700
                               text-white font-bold text-sm transition inline-flex items-center gap-2">
              <Icon.Check width="16" height="16" /> إضافة
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">المادة</label>
            <input
              autoFocus
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="مثال: مواد أولية - نوع ج"
              className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                         focus:border-blue-500 focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">النوع</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                         focus:border-blue-500 focus:bg-white outline-none transition"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">الكمية</label>
            <input
              type="number"
              min="1"
              value={formQty}
              onChange={(e) => setFormQty(e.target.value)}
              placeholder="مثال: 500"
              className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                         focus:border-blue-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════
       *  Modal التعديل
       * ═══════════════════════════════════════════════ */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="تعديل الاحتياج"
        icon="Edit"
        footer={
          <>
            <button onClick={() => setEditOpen(false)}
                    className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200
                               text-slate-700 font-bold text-sm transition">
              إلغاء
            </button>
            <button onClick={confirmEdit}
                    className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600
                               text-white font-bold text-sm transition inline-flex items-center gap-2">
              <Icon.Check width="16" height="16" /> حفظ التعديل
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">المادة</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                         focus:border-blue-500 focus:bg-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">النوع</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                         focus:border-blue-500 focus:bg-white outline-none transition"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">الكمية</label>
            <input
              type="number"
              min="1"
              value={formQty}
              onChange={(e) => setFormQty(e.target.value)}
              className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                         focus:border-blue-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}