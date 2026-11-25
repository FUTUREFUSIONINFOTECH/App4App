import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10284f]/50 p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[640px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-[20px] bg-white p-6 sm:p-7 shadow-[0_25px_70px_rgba(16,40,79,0.28)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-[20px] font-bold text-[#172b4d]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg bg-[#eff3f9] p-2 text-[#52647f] transition hover:bg-[#e1e9f5] focus-visible:outline-2 focus-visible:outline-[#1763d5]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 text-[13px] text-[#52647f]">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
