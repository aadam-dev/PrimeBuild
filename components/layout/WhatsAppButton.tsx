"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, FileText, HelpCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

const quickActions = [
  {
    icon: FileText,
    label: "Send Quote PDF",
    message: "Hi, I'd like to send my current quote for review.",
  },
  {
    icon: HelpCircle,
    label: "Get Help",
    message: "Hi, I need help with my order on Prime Build.",
  },
  {
    icon: Phone,
    label: "Call Back Request",
    message: "Hi, please call me back regarding my procurement needs.",
  },
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="glass rounded-2xl border border-slate-200/60 p-4 shadow-xl w-72"
          >
            <div className="mb-3">
              <h4 className="text-sm font-bold text-slate-950">Chat with Prime Build</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Get instant support via WhatsApp
              </p>
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => openWhatsApp(action.message)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-100/60"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                    <action.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-colors ${
          isOpen
            ? "bg-slate-950 text-white"
            : "bg-emerald-500 text-white animate-pulse-ring"
        }`}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}
