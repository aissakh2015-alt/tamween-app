import { Icon } from '../ui/Icon';

const NAV_ITEMS = [
  { key: 'home',         label: 'الرئيسية',  icon: 'Home'      },
  { key: 'requirements', label: 'الاحتياجات', icon: 'Clipboard' },
  { key: 'orders',       label: 'الطلبيات',   icon: 'Cart'      },
  { key: 'received',     label: 'المقتنيات',  icon: 'Package'   },
  { key: 'stock',        label: 'المخزون',    icon: 'Warehouse' },
  { key: 'reports',      label: 'التقارير',   icon: 'Chart'     },  // ← جديد
  { key: 'settings',     label: 'الإعدادات',  icon: 'Settings'  },
];

export default function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }) {
  const handleClick = (key) => {
    onNavigate(key);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* ── طبقة معتمة على الجوال ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* ── الشريط الجانبي ── */}
      <aside
        className={`
          w-[280px] bg-gradient-to-b from-slate-800 to-slate-700 text-white
          h-screen overflow-y-auto shadow-xl shrink-0 z-40
          fixed lg:sticky top-0 right-0
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ترويسة */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <h1 className="text-xl font-extrabold flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-full border-2 border-white/30 grid place-items-center">
              <Icon.Refresh width="20" height="20" />
            </div>
            دورة التموين
          </h1>
          {/* زر إغلاق على الجوال */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20
                       grid place-items-center transition"
          >
            <Icon.X width="18" height="18" />
          </button>
        </div>

        <p className="px-5 pt-2 pb-3 text-sm text-white/60">لوحة التحكم</p>

        {/* القائمة */}
        <nav className="py-3">
          {NAV_ITEMS.map((item) => {
            const IconComponent = Icon[item.icon];
            const isActive = activePage === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleClick(item.key)}
                className={`px-5 py-3.5 flex items-center gap-3.5 cursor-pointer
                           transition-all text-base font-semibold
                           ${isActive
                             ? 'bg-white/15 border-r-4 border-emerald-500'
                             : 'hover:bg-white/10 border-r-4 border-transparent'}`}
              >
                <IconComponent width="22" height="22" className="shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}