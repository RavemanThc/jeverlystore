"use client";
import { useEffect, useRef } from "react";
import Icon from "../Icon/Icon";
import styles from "./Dialog.module.css";
export default function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    const focus = document.activeElement as HTMLElement | null;
    d?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d?.close();
      document.body.style.overflow = old;
      focus?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="dialog-title"
    >
      <div className={styles.heading}>
        <h2 id="dialog-title">{title}</h2>
        <button onClick={onClose} aria-label="Закрити">
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
