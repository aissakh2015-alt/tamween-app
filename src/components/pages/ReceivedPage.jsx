import { useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';

export default function ReceivedPage({ received }) {
  const [sortKey, setSortKey] = useState('dateReceived');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    const copy = [...received];
    copy.sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (sortKey === 'qty') return sortDir === 'asc' ? va - vb : vb - va;
      const cmp = String(va).localeCompare(String(vb), 'ar');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [received, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-slate-300 ml-1">⇅</span>;
    return <span className="text-blue-600 ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  // ═══ حساب المدة بين الإرسال والاستلام ═══
  const daysBetween = (d1, d2) => {
    if (!d1 || !d2) return '—';
    const a = new Date(d1.replace(' ', 'T'));
    const b = new Date(d2.replace(' ', 'T'));
    const diff = Math.ceil(Math.abs(b - a) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
          <Icon.Package width="22" height="22" />
          سجل المقتنيات
        </h3>
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          سجل تاريخي مرتب
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th onClick={() => handleSort('orderId')}      className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">رقم الطلبية <SortIcon col="orderId" /></th>
              <th onClick={() => handleSort('name')}         className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">المادة <SortIcon col="name" /></th>
              <th onClick={() => handleSort('type')}         className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">النوع <SortIcon col="type" /></th>
              <th onClick={() => handleSort('qty')}          className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">الكمية <SortIcon col="qty" /></th>
              <th onClick={() => handleSort('supplier')}     className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">المورد <SortIcon col="supplier" /></th>
              <th onClick={() => handleSort('dateCreated')}  className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الطلب <SortIcon col="dateCreated" /></th>
              <th onClick={() => handleSort('dateSent')}     className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الإرسال <SortIcon col="dateSent" /></th>
              <th onClick={() => handleSort('dateReceived')} className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">تاريخ الاستلام <SortIcon col="dateReceived" /></th>
              <th className="text-right font-bold px-4 py-3 whitespace-nowrap">المدة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((r, i) => (
              <tr key={`${r.orderId}-${i}`} className="hover:bg-slate-50/70 transition">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">#{r.orderId}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{r.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.type}</td>
                <td className="px-4 py-3 font-bold text-slate-800">{r.qty}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{r.supplier}</td>
                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.dateCreated}</td>
                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.dateSent}</td>
                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{r.dateReceived}</td>
                <td className="px-4 py-3">
                  <span className="font-bold text-slate-800">{daysBetween(r.dateSent, r.dateReceived)}</span>
                  <span className="text-xs text-slate-500"> يوم</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {received.length === 0 && (
          <div className="text-center text-slate-400 py-16">
            📦 لا توجد مقتنيات بعد
          </div>
        )}
      </div>
    </div>
  );
}