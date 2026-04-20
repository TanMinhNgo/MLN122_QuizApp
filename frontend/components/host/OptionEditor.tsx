import { Option } from "@/types";

interface OptionEditorProps {
  option: Option;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function OptionEditor({ option, label, checked, onToggle }: OptionEditorProps) {
  return (
    <label
      className="flex items-center gap-3 rounded-lg border border-white/25 bg-white/10 p-3"
      style={{ borderLeftWidth: "6px", borderLeftColor: option.color }}
    >
      <span className="w-5 shrink-0 text-center font-bold">{label}</span>
      <input
        value={option.text}
        readOnly
        className="w-full bg-transparent text-sm text-white/90 outline-none"
      />
      <input type="checkbox" checked={checked} onChange={onToggle} />
    </label>
  );
}
