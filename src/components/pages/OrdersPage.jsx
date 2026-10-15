import { useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';
import Modal from '../ui/Modal';

export default function OrdersPage({ orders, onAdvance, onEdit }) {
  const [sortKey, setSortKey] = useState('dateCreated');
  const [sortDir, setSortDir] = useState('desc');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formSupplier, setFormSupplier] = useState('');
  const [formQty, setFormQty] = useState('');

  const sortedOrders = useMemo(() => {
    const copy = [...orders];
    copy.sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (sortKey === 'qty') return sortDir === 'asc' ? va - vb : vb - va;
      const cmp = String(va).localeCompare(String(vb), 'ar');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [orders, sortKey, sortDir]);

  const pending = sortedOrders.filter(o => o.status === 'orange' || o.status === 'blue');
  const done    = sortedOrders.filter(o => o.status === 'green');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-slate-300 ml-1">⇅</span>;
    return <span className="text-blue-600 ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  const openEdit = (order) => {
    setEditing(order);
    setFormSupplier(order.supplier);
    setFormQty(order.qty);
    setEditOpen(true);
  };

  const confirmEdit = () => {
    const supplier = formSupplier.trim();
    const qty = parseInt(formQty);
    if (!supplier || !qty || qty <= 0) {
      alert('⚠️ الرجاء إدخال بيانات صحيحة');
      return;
    }
    onEdit(editing.id, { supplier, qty });
    setEditOpen(false);
    setEditing(null);
  };

  // ═══ شارة الحالة ═══
  const StatusPill = ({ status }) => {
    const styles = {
      orange: { cls: 'bg-amber-50 text-amber-700 border-amber-200', IconComp: Icon.Clock, label: 'قيد الانتظار' },
      blue:   { cls: 'bg-blue-50 text-blue-700 border-blue-200',   IconComp: Icon.Truck, label: 'في الطريق' },
      green:  { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', IconComp: Icon.Check, label: 'تم إنجازه' },
    };
    const s = styles[status] || styles.orange;
    const IconComp = s.IconComp;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1
                        rounded-full border whitespace-nowrap ${s.cls}`}>
        <IconComp width="13" height="13" /> {s.label}
      </span>
    );
  };

  // ═══ صف الطلبية ═══
  const OrderRow = ({ o, isDone = false }) => (
    <tr className="hover:bg-slate-50/70 transition">
      <td className="px-4 py-3 font-mono text-xs text-slate-500">#{o.id}</td>
      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{o.dateCreated}</td>
      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
        {o.dateSent || <span className="text-slate-300">—</span>}
      </td>
      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
        {o.dateReceived || <span className="text-slate-300">—</span>}
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">{o.supplier}</td>
      <td className="px-4 py-3 font-semibold text-slate-800">{o.name}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{o.qty}</td>
      <td className="px-4 py-3"><StatusPill status={o.status} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {!isDone && (
            <button
              onClick={() => onAdvance(o.id)}
              title={o.status === 'orange' ? 'إرسال إلى المورد' : 'استلام الشحنة'}
              className={`w-9 h-9 rounded-lg grid place-items-center text-white transition shadow-sm
                         ${o.status === 'orange'
                           ? 'bg-blue-500 hover:bg-blue-600'
                           : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              {o.status === 'orange' ? <Icon.Truck width="16" height="16" /> : <Icon.Check width="16" height="16" />}
            </button>
          )}
          <button
            onClick={() => openEdit(o)}
            title="تعديل"
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-white
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
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Icon.Cart width="22" height="22" />
            جدول متابعة الطلبيات
          </h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            انقر على عمود للفرز
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th onClick={() => handleSort('id')}           className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">رقم الطلبية <SortIcon col="id" /></th>
                <th onClick={() => handleSort('dateCreated')}  className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الطلبية <SortIcon col="dateCreated" /></th>
                <th onClick={() => handleSort('dateSent')}     className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الإرسال <SortIcon col="dateSent" /></th>
                <th onClick={() => handleSort('dateReceived')} className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الاستلام <SortIcon col="dateReceived" /></th>
                <th onClick={() => handleSort('supplier')}     className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">المورد <SortIcon col="supplier" /></th>
                <th onClick={() => handleSort('name')}         className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">المادة <SortIcon col="name" /></th>
                <th onClick={() => handleSort('qty')}          className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">الكمية <SortIcon col="qty" /></th>
                <th className="text-right font-bold px-4 py-3 whitespace-nowrap">الحالة</th>
                <th className="text-right font-bold px-4 py-3 whitespace-nowrap">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

              {pending.length > 0 && (
                <>
                  <tr>
                    <td colSpan="9" className="bg-slate-800 text-white text-center text-xs font-bold py-2.5 tracking-wide">
                      ⬆️ قيد الانتظار / في الطريق &nbsp;|&nbsp; تم إنجازه ⬇️
                    </td>
                  </tr>
                  {pending.map(o => <OrderRow key={o.id} o={o} />)}
                </>
              )}

              {pending.length > 0 && done.length > 0 && (
                <tr>
                  <td colSpan="9" className="bg-slate-100 text-center text-xs font-bold text-slate-500 py-2">
                    ⬇️ طلبيات مكتملة
                  </td>
                </tr>
              )}

              {done.map(o => <OrderRow key={o.id} o={o} isDone />)}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center text-slate-400 py-16">
              📭 لا توجد طلبيات بعد
            </div>
          )}
        </div>
      </div>

      {/* ═══ Modal التعديل ═══ */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="تعديل الطلبية"
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
            <label className="block text-sm font-bold text-slate-700 mb-1.5">المورد</label>
            <input type="text" value={formSupplier}
                   onChange={(e) => setFormSupplier(e.target.value)}
                   className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                              focus:border-blue-500 focus:bg-white outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">الكمية</label>
            <input type="number" min="1" value={formQty}
                   onChange={(e) => setFormQty(e.target.value)}
                   className="w-full h-11 rounded-xl border-2 border-slate-200 bg-slate-50 px-4
                              focus:border-blue-500 focus:bg-white outline-none transition" />
          </div>
        </div>
      </Modal>
    </>
  );
}