// ═══════════════════════════════════════════════════
//  البيانات التجريبية — مكان واحد لكل البيانات
// ═══════════════════════════════════════════════════

export const TYPES = [
  'مواد أولية',
  'تغليف',
  'ملصقات',
  'مواد كيميائية',
  'مواد استهلاكية',
  'قطع غيار',
];

export const INITIAL_STOCK = [
  { name: 'مواد أولية - نوع أ', type: 'مواد أولية',    current: 120,  min: 200, lastUpdate: '2026-10-01 09:30' },
  { name: 'مواد تغليف - كرتون', type: 'تغليف',         current: 80,   min: 150, lastUpdate: '2026-10-02 10:15' },
  { name: 'مواد أولية - نوع ب', type: 'مواد أولية',    current: 450,  min: 300, lastUpdate: '2026-10-03 14:00' },
  { name: 'ملصقات - حجم صغير',  type: 'ملصقات',        current: 1200, min: 500, lastUpdate: '2026-09-28 11:20' },
  { name: 'مواد تغليف - أكياس', type: 'تغليف',         current: 200,  min: 400, lastUpdate: '2026-09-30 16:45' },
  { name: 'ملصقات - حجم كبير',  type: 'ملصقات',        current: 900,  min: 600, lastUpdate: '2026-09-25 08:30' },
];

export const INITIAL_REQUIREMENTS = [
  { id: 'REQ-001', dateCreated: '2026-10-01 09:30', name: 'مواد أولية - نوع أ', type: 'مواد أولية', qty: 500,  status: 'red'    },
  { id: 'REQ-002', dateCreated: '2026-10-03 11:00', name: 'مواد تغليف - كرتون', type: 'تغليف',      qty: 200,  status: 'red'    },
  { id: 'REQ-003', dateCreated: '2026-10-05 14:20', name: 'مواد أولية - نوع ب', type: 'مواد أولية', qty: 300,  status: 'red'    },
  { id: 'REQ-004', dateCreated: '2026-09-28 10:00', name: 'ملصقات - حجم صغير',  type: 'ملصقات',     qty: 1000, status: 'orange' },
  { id: 'REQ-005', dateCreated: '2026-09-30 15:30', name: 'مواد تغليف - أكياس', type: 'تغليف',      qty: 800,  status: 'orange' },
  { id: 'REQ-006', dateCreated: '2026-09-25 08:00', name: 'ملصقات - حجم كبير',  type: 'ملصقات',     qty: 600,  status: 'orange' },
];

export const INITIAL_ORDERS = [
  { id: 'CMD-001', dateCreated: '2026-10-02 10:00', dateSent: '2026-10-03 09:00', dateReceived: '2026-10-05 14:30', supplier: 'مورد أ', name: 'مواد أولية - نوع أ', type: 'مواد أولية', qty: 500,  status: 'green',  reqId: 'REQ-001' },
  { id: 'CMD-002', dateCreated: '2026-10-04 11:30', dateSent: '2026-10-05 10:00', dateReceived: null,               supplier: 'مورد ب', name: 'مواد تغليف - كرتون', type: 'تغليف',      qty: 200,  status: 'blue',   reqId: 'REQ-002' },
  { id: 'CMD-003', dateCreated: '2026-09-29 09:00', dateSent: null,               dateReceived: null,               supplier: 'مورد ج', name: 'ملصقات - حجم صغير',  type: 'ملصقات',     qty: 1000, status: 'orange', reqId: 'REQ-004' },
  { id: 'CMD-004', dateCreated: '2026-10-06 13:00', dateSent: '2026-10-07 08:30', dateReceived: '2026-10-09 11:00', supplier: 'مورد أ', name: 'مواد أولية - نوع ب', type: 'مواد أولية', qty: 300,  status: 'green',  reqId: 'REQ-003' },
  { id: 'CMD-005', dateCreated: '2026-09-30 16:00', dateSent: null,               dateReceived: null,               supplier: 'مورد د', name: 'مواد تغليف - أكياس', type: 'تغليف',      qty: 800,  status: 'orange', reqId: 'REQ-005' },
];

export const INITIAL_RECEIVED = [
  { orderId: 'CMD-001', name: 'مواد أولية - نوع أ', type: 'مواد أولية', qty: 500, supplier: 'مورد أ', dateCreated: '2026-10-02 10:00', dateSent: '2026-10-03 09:00', dateReceived: '2026-10-05 14:30' },
  { orderId: 'CMD-004', name: 'مواد أولية - نوع ب', type: 'مواد أولية', qty: 300, supplier: 'مورد أ', dateCreated: '2026-10-06 13:00', dateSent: '2026-10-07 08:30', dateReceived: '2026-10-09 11:00' },
];