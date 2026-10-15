import { Icon } from './Icon';

export default function Modal({ open, onClose, title, icon = 'Clipboard', children, footer }) {
  if (!open) return null;

  const IconComponent = Icon[icon];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeIn_.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ترويسة */}
        <div className="flex items-center gap-3 p-5 border-b-2 border-slate-100">
          <IconComponent width="22" height="22" className="text-slate-700" />
          <h3 className="text-xl font-bold text-slate-800 flex-1">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white
                       grid place-items-center transition"
          >
            <Icon.X width="18" height="18" />
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-5">{children}</div>

        {/* تذييل */}
        {footer && (
          <div className="p-4 border-t-2 border-slate-100 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}