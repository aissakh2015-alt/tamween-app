import { Icon } from '../ui/Icon';

const PAGE_TITLES = {
  home:         { label: 'الرئيسية',  icon: 'Home'      },
  requirements: { label: 'الاحتياجات', icon: 'Clipboard' },
  orders:       { label: 'الطلبيات',   icon: 'Cart'      },
  received:     { label: 'المقتنيات',  icon: 'Package'   },
  stock:        { label: 'المخزون',    icon: 'Warehouse' },
  settings:     { label: 'الإعدادات',  icon: 'Settings'  },
};

export default function TopHeader({ page, onOpenMobile }) {
  const config = PAGE_TITLES[page] || PAGE_TITLES.home;
  const IconComponent = Icon[config.icon];

  const today = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-slate-200 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* زر القائمة على الجوال */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-sm
                     grid place-items-center hover:bg-slate-50 transition shrink-0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800
                       flex items-center gap-2.5 truncate">
          <IconComponent width="28" height="28" className="shrink-0" />
          <span className="truncate">{config.label}</span>
        </h2>
      </div>

      <span className="hidden sm:block bg-white px-4 py-2 rounded-full text-xs sm:text-sm
                       text-slate-500 shadow-sm shrink-0">
        {today}
      </span>
    </div>
  );
}