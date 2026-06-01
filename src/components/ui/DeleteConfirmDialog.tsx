"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentPortal } from "@/components/ui/DocumentPortal";
import { lockBodyScroll } from "@/lib/body-scroll-lock";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  assetName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog = ({
  isOpen,
  assetName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const release = lockBodyScroll();
    return release;
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onCancel, onConfirm]);

  return (
    <DocumentPortal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-[#001e2b]/80 backdrop-blur-sm"
              onClick={onCancel}
            />

            {/* Dialog */}
            <motion.div
              key="dlg"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-[601] w-full max-w-[360px] rounded-2xl border border-[#3d4f58] bg-[#1c2d38]"
              style={{
                boxShadow:
                  "0 24px 48px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.16)",
              }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="del-title"
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[3px] text-[#5c6c75] mb-2">
                    Confirm action
                  </p>
                  <h2
                    id="del-title"
                    className="font-archivo text-[20px] font-bold text-white leading-tight"
                  >
                    Delete this asset?
                  </h2>
                </div>

                {/* Asset name */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#001e2b] border border-[#3d4f58] mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3d4f58] shrink-0" />
                  <span className="font-mono text-[13px] text-[#b8c4c2] truncate leading-none">
                    {assetName}
                  </span>
                </div>

                {/* Description */}
                <p className="font-mono text-[11px] text-[#5c6c75] leading-relaxed mb-6 uppercase tracking-[1px]">
                  Asset ini akan terhapus secara permanen dari dashboard kamu.
                </p>

                {/* Divider */}
                <div className="h-px bg-[#3d4f58] mb-5" />

                {/* Actions */}
                <div className="flex gap-2.5">
                  <button
                    id="del-cancel"
                    type="button"
                    onClick={onCancel}
                    className="flex-1 h-10 rounded-xl font-mono text-[11px] font-semibold uppercase tracking-[2px] border border-[#3d4f58] text-[#5c6c75] hover:text-[#b8c4c2] hover:border-[#5c6c75] transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    id="del-confirm"
                    type="button"
                    onClick={onConfirm}
                    className="flex-[1.4] h-10 rounded-xl font-mono text-[11px] font-bold uppercase tracking-[2px] bg-[#3d1414] border border-[#7f2020] text-[#f87171] hover:bg-[#4a1a1a] hover:border-[#ef4444] hover:text-[#fca5a5] transition-all duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DocumentPortal>
  );
};
