import React from "react";
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full relative max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-xl" onClick={onClose} aria-label="Close modal">&#x2715;</button>
        {children}
      </div>
    </div>
  );
}
