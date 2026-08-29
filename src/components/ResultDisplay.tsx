import { CheckCircle2, Download, RotateCcw } from 'lucide-react';

interface ResultDisplayProps {
  imageUrl: string;
  onReset: () => void;
}

export function ResultDisplay({ imageUrl, onReset }: ResultDisplayProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sellerai-card-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="animate-slide-up rounded-2xl border border-brand-200/60 bg-white/80 p-5 shadow-lg backdrop-blur-sm dark:border-brand-800/60 dark:bg-brand-950/60">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Карточка готова
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Создать новую
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt="Generated marketplace card"
          className="w-full object-contain"
        />
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-500/40 active:scale-100"
      >
        <Download className="h-5 w-5" />
        Скачать карточку
      </button>
    </div>
  );
}
