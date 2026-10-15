import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import HomePage from './components/pages/HomePage';
import RequirementsPage from './components/pages/RequirementsPage';
import OrdersPage from './components/pages/OrdersPage';
import ReceivedPage from './components/pages/ReceivedPage';
import StockPage from './components/pages/StockPage';
import SettingsPage from './components/pages/SettingsPage';
import { useLocalStorage, clearAppStorage } from './hooks/useLocalStorage';
import ReportsPage from './components/pages/ReportsPage';
import InstallPrompt from './components/layout/InstallPrompt';
import {
  TYPES,
  INITIAL_STOCK,
  INITIAL_REQUIREMENTS,
  INITIAL_ORDERS,
  INITIAL_RECEIVED,
} from './data/mockData';

function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const mn = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${mn}`;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stock, setStock]               = useLocalStorage('stock', INITIAL_STOCK);
  const [requirements, setRequirements] = useLocalStorage('requirements', INITIAL_REQUIREMENTS);
  const [orders, setOrders]             = useLocalStorage('orders', INITIAL_ORDERS);
  const [received, setReceived]         = useLocalStorage('received', INITIAL_RECEIVED);
  const [counters, setCounters]         = useLocalStorage('counters', { req: 7, cmd: 6 });

  const [saveStatus, setSaveStatus] = useState('');
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveStatus('💾 تم الحفظ');
    const t = setTimeout(() => setSaveStatus(''), 1500);
    return () => clearTimeout(t);
  }, [stock, requirements, orders, received]);

  const handleAddRequirement = ({ name, type, qty }) => {
    const id = 'REQ-' + String(counters.req).padStart(3, '0');
    setCounters(c => ({ ...c, req: c.req + 1 }));
    setRequirements(prev => [...prev, {
      id,
      dateCreated: getToday(),
      name, type, qty,
      status: 'red',
    }]);
  };

  const handleEditRequirement = (id, patch) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const handleConvertToOrder = (reqId) => {
    const req = requirements.find(r => r.id === reqId);
    if (!req) return;

    setRequirements(prev =>
      prev.map(r => r.id === reqId ? { ...r, status: 'orange' } : r)
    );

    const cmdId = 'CMD-' + String(counters.cmd).padStart(3, '0');
    setCounters(c => ({ ...c, cmd: c.cmd + 1 }));

    setOrders(prev => [...prev, {
      id: cmdId,
      dateCreated: getToday(),
      dateSent: null,
      dateReceived: null,
      supplier: 'مورد جديد',
      name: req.name,
      type: req.type,
      qty: req.qty,
      status: 'orange',
      reqId: req.id,
    }]);
  };

  const handleEditOrder = (id, patch) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  const handleAdvanceOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.status === 'orange') {
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'blue', dateSent: getToday() } : o
      ));
      return;
    }

    if (order.status === 'blue') {
      const now = getToday();

      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'green', dateReceived: now } : o
      ));

      setStock(prev => {
        const existing = prev.find(s => s.name === order.name);
        if (existing) {
          return prev.map(s =>
            s.name === order.name
              ? { ...s, current: s.current + order.qty, lastUpdate: now }
              : s
          );
        }
        return [...prev, {
          name: order.name,
          type: order.type || 'جديد',
          current: order.qty,
          min: Math.round(order.qty * 0.3),
          lastUpdate: now,
        }];
      });

      setReceived(prev => [...prev, {
        orderId: order.id,
        name: order.name,
        type: order.type || 'جديد',
        qty: order.qty,
        supplier: order.supplier,
        dateCreated: order.dateCreated,
        dateSent: order.dateSent,
        dateReceived: now,
      }]);
    }
  };

  const handleReset = () => {
    if (!window.confirm('⚠️ سيتم حذف كل البيانات وإعادتها للوضع الافتراضي. متأكد؟')) return;
    clearAppStorage();
    setStock(INITIAL_STOCK);
    setRequirements(INITIAL_REQUIREMENTS);
    setOrders(INITIAL_ORDERS);
    setReceived(INITIAL_RECEIVED);
    setCounters({ req: 7, cmd: 6 });
  };
  const handleImportData = (data) => {
    if (data.stock)         setStock(data.stock);
    if (data.requirements)  setRequirements(data.requirements);
    if (data.orders)        setOrders(data.orders);
    if (data.received)      setReceived(data.received);
    if (data.counters)      setCounters(data.counters);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage requirements={requirements} orders={orders} stock={stock} onNavigate={setPage} />;
      case 'requirements':
        return <RequirementsPage requirements={requirements} types={TYPES}
                                  onAdd={handleAddRequirement}
                                  onEdit={handleEditRequirement}
                                  onConvert={handleConvertToOrder} />;
      case 'orders':
        return <OrdersPage orders={orders} onAdvance={handleAdvanceOrder} onEdit={handleEditOrder} />;
      case 'received':
        return <ReceivedPage received={received} />;
      case 'stock':
        return <StockPage stock={stock} />;
      case 'reports':
        return (
          <ReportsPage
            stock={stock}
            requirements={requirements}
            orders={orders}
            received={received}
            onImportData={handleImportData}
          />
        );
      case 'settings':
        return <SettingsPage types={TYPES} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex bg-slate-100 font-sans">
      <Sidebar
        activePage={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 lg:pb-8">
        <TopHeader page={page} onOpenMobile={() => setMobileOpen(true)} />
        {renderPage()}

        <footer className="text-center text-sm text-slate-400 py-6 mt-8">
          © 2026 - تطبيق دورة التموين
        </footer>
      </main>

            {saveStatus && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white
                        px-5 py-3 rounded-xl shadow-2xl text-sm font-bold
                        flex items-center gap-2 animate-pulse-soft">
          {saveStatus}
        </div>
      )}

      <InstallPrompt />
    </div>
  );
}