"use client";

import { useEffect, useState } from "react";

// Confirmação de ação ("salvo", "removido") que some sozinha depois de alguns segundos.
export function Flash({ message }: { message?: string }) {
  const [visible, setVisible] = useState(Boolean(message));
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(t);
  }, [message]);
  if (!message || !visible) return null;
  return (
    <div
      role="status"
      className="float-in fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-profundo px-5 py-3 text-sm text-white shadow-xl"
    >
      <span className="icon icon-fill text-xl! text-emerald-400">check_circle</span>
      {message}
    </div>
  );
}
