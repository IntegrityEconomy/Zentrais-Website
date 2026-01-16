import { cn } from '../utils';

interface RadioRowProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

export function RadioRow({ label, checked, onClick }: RadioRowProps) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 py-1.5 text-left">
      <span className={cn('grid h-4 w-4 place-items-center rounded-full border', checked ? 'border-[#B56A1E]' : 'border-slate-400')}>
        {checked && <span className="h-2 w-2 rounded-full bg-[#B56A1E]" />}
      </span>
      <span className="text-[13px] text-slate-700">{label}</span>
    </button>
  );
}