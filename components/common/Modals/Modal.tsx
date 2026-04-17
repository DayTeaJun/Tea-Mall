"use client";

import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-6 sm:pt-12"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 p-6 relative animate-fade-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-[18px] sm:text-xl font-bold text-gray-900 mb-2">
          {title}
        </h2>

        {description && (
          <p className="text-[12px] sm:text-sm text-gray-600 mb-4 whitespace-pre-line">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
