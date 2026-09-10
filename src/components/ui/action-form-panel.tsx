"use client";

interface ActionFormPanelProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  children: React.ReactNode;
}

export function ActionFormPanel({
  title,
  onClose,
  onSave,
  saveLabel = "Simpan",
  children,
}: ActionFormPanelProps) {
  return (
    <div className="mb-5 bg-white border border-slds-border rounded-lg p-4 shadow-sm">
      <p className="text-[13px] font-bold text-slds-text mb-4">{title}</p>
      {children}
      <div className="flex gap-2 mt-4 pt-4 border-t border-slds-border">
        <button
          type="button"
          data-no-toast
          onClick={onSave}
          className="px-4 py-2 bg-brand text-white rounded-md text-[13px] font-semibold hover:bg-brand-dark transition-colors"
        >
          {saveLabel}
        </button>
        <button
          type="button"
          data-no-toast
          onClick={onClose}
          className="px-4 py-2 border border-slds-border rounded-md text-[13px] hover:bg-slds-bg transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export const fieldClass =
  "w-full mt-1 px-3 py-2 border border-slds-border rounded-md text-[13px] focus:border-brand focus:outline-none";
export const labelClass = "text-[11px] text-slds-text-weak uppercase font-semibold";
