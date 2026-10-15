import { useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';

export default function StockPage({ stock }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    const copy = [...stock];
    copy.sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (['current', 'min'].includes(sortKey)) {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const cmp = String(va).localeCompare(String(vb), 'ar');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [stock, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-slate-300 ml-1">⇅</span>;
    return <span className="text-blue-600 ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  const lowCount = stock.filter(s => s.current <= s.min).length;

  return (
    <div className="space-y-4">

      {/* ═══ شريط ملخّص ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
            <Icon.Warehouse width="22" height="22" />
          </div>
          <div>
            <div className="text-slate-500 text-xs">إجمالي الأصناف</div>
            <div className="text-2xl font-extrabold text-slate-800">{stock.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 grid place-items-center">
            <Icon.Alert width="22" height="22" />
          </div>
          <div>
            <div className="text-slate-500 text-xs">تحت الحد الأدنى</div>
            <div className="text-2xl font-extrabold text-red-600">{lowCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
            <Icon.Check width="22" height="22" />
          </div>
          <div>
            <div className="text-slate-500 text-xs">أصناف كافية</div>
            <div className="text-2xl font-extrabold text-emerald-600">{stock.length - lowCount}</div>
          </div>
        </div>
      </div>

      {/* ═══ الجدول ═══ */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <Icon.Warehouse width="22" height="22" />
            المخزون
          </h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            الحد الأدنى للمخزون
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th onClick={() => handleSort('name')}       className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">المادة <SortIcon col="name" /></th>
                <th onClick={() => handleSort('type')}       className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">النوع <SortIcon col="type" /></th>
                <th onClick={() => handleSort('current')}    className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">الكمية الحالية <SortIcon col="current" /></th>
                <th onClick={() => handleSort('min')}        className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">الحد الأدنى <SortIcon col="min" /></th>
                <th onClick={() => handleSort('lastUpdate')} className="text-right font-bold px-4 py-3 cursor-pointer hover:bg-slate-100 whitespace-nowrap">آخر تحديث <SortIcon col="lastUpdate" /></th>
                <th className="text-right font-bold px-4 py-3 whitespace-nowrap">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((item, i) => {
                const isLow = item.current <= item.min;
                return (
                  <tr key={i}
                      className={`transition ${isLow ? 'bg-red-50/60 hover:bg-red-50' : 'hover:bg-slate-50/70'}`}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.type}</td>
                    <td className={`px-4 py-3 font-bold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>
                      {item.current}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.min}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{item.lastUpdate}</td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1
                                         rounded-full bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
                          <Icon.Alert width="13" height="13" /> تحت الحد الأدنى
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1
                                         rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          <Icon.Check width="13" height="13" /> كافٍ
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {stock.length === 0 && (
            <div className="text-center text-slate-400 py-16">
              🏭 المخزون فارغ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}