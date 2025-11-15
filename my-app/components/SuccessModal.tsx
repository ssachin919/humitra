"use client";

import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-pastel-green flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-5xl text-primary">
              check_circle
            </span>
          </div>

          <h2 className="text-text-primary text-2xl font-bold">
            Application Submitted!
          </h2>

          <p className="text-text-secondary text-base leading-relaxed">
            Thank you for your interest in joining Humitra. We've received your
            application and will review it shortly. We'll get back to you soon!
          </p>

          <button
            onClick={onClose}
            className="mt-4 w-full flex items-center justify-center rounded-full h-12 px-6 bg-primary text-text-primary text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity duration-200 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

