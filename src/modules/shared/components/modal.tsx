import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { IC_CLOSEHAMBURGER } from '../icons/nav';

interface MobileModalProps {
  header: ReactNode;
  whiteBg?: boolean;
  modalBtnId: string;
  children: ReactNode;
  closeRef?: string;
  id?: string;
}

export function MobileModal({
  id,
  header,
  whiteBg,
  closeRef,
  children,
  modalBtnId,
}: MobileModalProps) {
  const [modalBtn, setModalBtn] = useState<HTMLElement | null>(null);
  const [isModalOpen, updateModal] = useState(false);

  const switchModal = useCallback(
    (x: boolean) => () => {
      const btn = document.getElementById(modalBtnId);
      if (!modalBtn) setModalBtn(btn);
      updateModal(x);
    },
    [isModalOpen]
  );

  useEffect(() => {
    const btn = document.getElementById(modalBtnId);
    if (btn) btn.onclick = switchModal(true);
    if (closeRef) {
      const close = document.getElementById(closeRef);
      if (close) close.onclick = switchModal(false);
    }
  }, []);

  return (
    <section
      id={id}
      className={clsx(
        'fixed inset-0 z-50 flex h-screen w-screen flex-col px-3',
        whiteBg && 'bg-white',
        !whiteBg && ' bg-accent-3',
        isModalOpen && 'slide-in-right',
        !modalBtn && !isModalOpen && 'hidden',
        modalBtn && !isModalOpen && 'slide-out-right'
      )}
    >
      <div className="flex flex-row px-2 py-3">
        {header}
        <span className="flex-1" />
        <button
          type="button"
          title="Close Navigation Modal"
          aria-label="Close Navigation Modal"
          onClick={() => updateModal(false)}
          className="hidden h-9 w-9 justify-center self-center rounded bg-accent-1 max-md:flex"
        >
          <IC_CLOSEHAMBURGER className="h-[14px] w-[14px] self-center" />
        </button>
      </div>
      <div className="relative flex flex-1 flex-col">{children}</div>
    </section>
  );
}
