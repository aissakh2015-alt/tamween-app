import * as XLSX from 'xlsx';

/* ═══════════════════════════════════════════════════
 *  تصدير مصفوفة إلى ملف Excel
 * ═══════════════════════════════════════════════════ */
export function exportToExcel(data, columns, filename, sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    alert('⚠️ لا توجد بيانات للتصدير');
    return;
  }

  // تحويل البيانات لصفوف بأعمدة عربية
  const rows = data.map((row) => {
    const out = {};
    columns.forEach((col) => {
      out[col.label] = col.transform ? col.transform(row) : (row[col.key] ?? '');
    });
    return out;
  });

  // إنشاء المصنّف
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // ضبط عرض الأعمدة
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.label.length + 4, 15),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // التاريخ في اسم الملف
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${filename}_${date}.xlsx`);
}

/* ═══════════════════════════════════════════════════
 *  تصدير الكل في ملف واحد (متعدد الأوراق)
 * ═══════════════════════════════════════════════════ */
export function exportAllToExcel({ stock, requirements, orders, received }) {
  const workbook = XLSX.utils.book_new();

  // ─── ورقة المخزون ───
  if (stock.length > 0) {
    const stockRows = stock.map((s) => ({
      'المادة':       s.name,
      'النوع':        s.type,
      'الكمية الحالية': s.current,
      'الحد الأدنى':   s.min,
      'الحالة':       s.current <= s.min ? 'تحت الحد الأدنى' : 'كافٍ',
      'النقص':        Math.max(0, s.min - s.current),
      'آخر تحديث':    s.lastUpdate,
    }));
    const ws = XLSX.utils.json_to_sheet(stockRows);
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'المخزون');
  }

  // ─── ورقة الاحتياجات ───
  if (requirements.length > 0) {
    const reqRows = requirements.map((r) => ({
      'الرقم':       r.id,
      'التاريخ':     r.dateCreated,
      'المادة':      r.name,
      'النوع':       r.type,
      'الكمية':      r.qty,
      'الحالة':      r.status === 'red' ? 'لم يتم' : 'تمت التلبية',
    }));
    const ws = XLSX.utils.json_to_sheet(reqRows);
    ws['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'الاحتياجات');
  }

  // ─── ورقة الطلبيات ───
  if (orders.length > 0) {
    const orderRows = orders.map((o) => ({
      'رقم الطلبية':   o.id,
      'تاريخ الطلب':   o.dateCreated,
      'تاريخ الإرسال': o.dateSent || '—',
      'تاريخ الاستلام': o.dateReceived || '—',
      'المورد':        o.supplier,
      'المادة':        o.name,
      'النوع':         o.type,
      'الكمية':        o.qty,
      'الحالة':        o.status === 'orange' ? 'قيد الانتظار'
                     : o.status === 'blue'   ? 'في الطريق'
                     : 'تم إنجازه',
    }));
    const ws = XLSX.utils.json_to_sheet(orderRows);
    ws['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'الطلبيات');
  }

  // ─── ورقة المقتنيات ───
  if (received.length > 0) {
    const receivedRows = received.map((r) => {
      let days = '—';
      if (r.dateSent && r.dateReceived) {
        const a = new Date(r.dateSent.replace(' ', 'T'));
        const b = new Date(r.dateReceived.replace(' ', 'T'));
        days = Math.ceil(Math.abs(b - a) / (1000 * 60 * 60 * 24));
      }
      return {
        'رقم الطلبية':   r.orderId,
        'المادة':        r.name,
        'النوع':         r.type,
        'الكمية':        r.qty,
        'المورد':        r.supplier,
        'تاريخ الطلب':   r.dateCreated,
        'تاريخ الإرسال': r.dateSent,
        'تاريخ الاستلام': r.dateReceived,
        'المدة (أيام)':  days,
      };
    });
    const ws = XLSX.utils.json_to_sheet(receivedRows);
    ws['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, ws, 'المقتنيات');
  }

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `تقرير_دورة_التموين_${date}.xlsx`);
}

/* ═══════════════════════════════════════════════════
 *  استيراد من ملف Excel
 * ═══════════════════════════════════════════════════ */
export function importFromExcel(file, onSuccess, onError) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet);
      onSuccess(rows);
    } catch (err) {
      console.error(err);
      onError?.(err);
    }
  };

  reader.onerror = (err) => {
    console.error(err);
    onError?.(err);
  };

  reader.readAsArrayBuffer(file);
}

/* ═══════════════════════════════════════════════════
 *  نسخة احتياطية JSON
 * ═══════════════════════════════════════════════════ */
export function exportBackupJSON(data) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `backup_tamween_${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importBackupJSON(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      onSuccess(data);
    } catch (err) {
      console.error(err);
      onError?.(err);
    }
  };
  reader.onerror = (err) => onError?.(err);
  reader.readAsText(file);
}